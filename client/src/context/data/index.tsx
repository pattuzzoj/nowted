import { createContext, createEffect, onCleanup, onMount, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";
import { useIndexedDB } from "@context/indexedDB";
import FolderService from "@services/folder";
import NoteService from "@services/note";
import SyncService from "@services/sync";
import { ActionRecord, Folder, Note } from "@/types";
import ActionRecordService from "@/services/actionRecord";

type DataContextType = [
  data: {
    folder: Folder;
    note: Note;
    recents: Note[];
    folders: Folder[];
    notes: Note[];
    favorites: Note[];
    archived: Note[];
    trash: Note[];
  },
  services: {
    folderService: {
      createFolder: (newFolder: Folder) => Promise<void>;
      updateFolder: (folder: Folder) => Promise<void>;
      deleteFolder: (id: string) => Promise<void>;
    };
    noteService: {
      createNote: (folderId: string) => Promise<void>;
      updateContent: (id: string, preview: string, content: string) => Promise<void>;
      favoriteNote: (id: string) => Promise<void>;
      unfavoriteNote: (id: string) => Promise<void>;
      archiveNote: (id: string) => Promise<void>;
      unarchiveNote: (id: string) => Promise<void>;
      restoreNote: (id: string) => Promise<void>;
      deleteNote: (id: string) => Promise<void>;
    }
  }
]

const DataContext = createContext<DataContextType>();

export default function DataProvider(props: ParentProps) {
  const [data, setData] = createStore<{
    folder: Folder,
    note: Note,
    recents: Note[],
    folders: Folder[],
    notes: Note[],
    favorites: Note[],
    archived: Note[],
    trash: Note[]
  }>({
    folder: {} as Folder,
    note: {} as Note,
    folders: [],
    notes: [],
    recents: [],
    favorites: [],
    archived: [],
    trash: []
  });
  const [useStore] = useIndexedDB();
  const actionRecordStore = useStore<ActionRecord>("action-record");
  const folderStore = useStore<Folder>("folder");
  const noteStore = useStore<Note>("note");
  const actionRecordService = ActionRecordService.getInstance(actionRecordStore);
  const folderService = FolderService.getInstance(folderStore, actionRecordService);
  const noteService = NoteService.getInstance(noteStore, actionRecordService);
  const syncService = SyncService.getInstance(actionRecordService, folderService, noteService);
  const params = useParams();

  onMount(async () => {
    if (!localStorage.getItem("lastSync")) {
      localStorage.setItem("lastSync", new Date("0").toISOString());
    }

    await syncService.syncFetch();

    const folders = (await folderService.getAll()).filter((folder) => folder.deleted_at === null);
    const favorites = await noteService.getFavoriteNotes();
    const archived = await noteService.getArchivedNotes();
    const trash = await noteService.getDeletedNotes();

    setData("folders", folders);
    setData("favorites", favorites);
    setData("archived", archived);
    setData("trash", trash);
  });

  async function createFolder(folderData: Folder) {
    const folder = await folderService.create(folderData);
    setData("folders", data.folders.length, folder);
  }

  async function updateFolder(folder: Folder) {
    await folderService.update(folder);
    setData("folders", (folders) => [
      ...folders.map((currentFolder) => {
        if (currentFolder.id === folder.id) {
          return folder;
        }

        return currentFolder;
      })
    ]);
  }

  async function deleteFolder(id: string) {
    await folderService.delete(id);
    const notes = await noteService.getNotesByFolderId(id);

    for (const note of notes) {
      await noteService.delete(note.id);
    }

    setData("folders", (folders) => [
      ...folders.filter((folder) => folder.id != id)
    ]);
  }

  async function restoreFolder(id: string) {
    const folder = await folderService.get(id);
    if (folder.deleted_at !== null) {
      await folderService.restore(folder.id);
      setData("folders", data.folders.length, folder);
    }
  }

  async function createNote(folderId: string) {
    const note = await noteService.create({ name: "New Note", folder_id: folderId } as Note);
    setData("notes", data.notes.length, note);
  }

  async function updateNote(note: Note) {
    await noteService.update(note);
    setData("notes", (notes) => [
      ...notes.map((currentNote) => {
        if (currentNote.id === note.id) {
          return note;
        }

        return currentNote;
      })
    ]);
  }

  async function updateContent(id: string, preview: string, content: string) {
    const note = await noteService.get(id);
    note.preview = preview;
    note.content = content;
    await updateNote(note);

  }

  async function favoriteNote(id: string) {
    const note = await noteService.favorite(id);
    setData("favorites", data.favorites.length, note);
  }

  async function unfavoriteNote(id: string) {
    const note = await noteService.unfavorite(id);
    setData("favorites", (notes) => [
      ...(notes).filter((currentNote) => currentNote.id != note.id)
    ]);
  }

  async function archiveNote(id: string) {
    const note = await noteService.archive(id);
    setData("notes", (notes) => [
      ...notes.filter((note) => note.id != id)
    ]);

    setData("archived", data.archived.length, note);
  }

  async function unarchiveNote(id: string) {

    const note = await noteService.unarchive(id);
    setData("archived", (notes) => [
      ...(notes).filter((currentNote) => currentNote.id != note.id)
    ]);
    setData("notes", data.archived.length, note);
  }

  async function restoreNote(id: string) {
    const note = await noteService.restore(id);
    await restoreFolder(note.folder_id);
    setData("trash", (notes) => [
      ...notes.filter((note) => note.id != id)
    ]);

    if (note.favorite) {
      setData("favorites", data.favorites.length, note);
    }

    if (note.archived) {
      setData("archived", data.archived.length, note);
    }

    if (data.folders.every((folder) => folder.id !== note.folder_id)) {
      const folders = (await folderService.getAll()).filter((folder) => folder.deleted_at === null);
      setData("folders", folders);
    }
  }

  async function deleteNote(id: string) {
    const note = await noteService.delete(id);
    setData("notes", (notes) => [
      ...notes.filter((note) => note.id != id)
    ]);

    setData("favorites", (notes) => [
      ...notes.filter((note) => note.id != id)
    ]);

    setData("archived", (notes) => [
      ...notes.filter((note) => note.id != id)
    ]);

    setData("trash", data.trash.length, note);
  }

  createEffect(async () => {
    if (params.folderId) {
      const folder = await folderService.get(params.folderId);
      const notes = await noteService.getNotesByFolderId(params.folderId);
      setData("folder", folder);
      setData("notes", notes);
    }
  });

  createEffect(async () => {
    if (params.noteId) {
      const note = await noteService.get(params.noteId);
      const recents = [...data.recents];
      recents.unshift(note);

      if (!data.recents.find((recentNote) => recentNote.id === note.id)) {
        setData("recents", recents.slice(0, 3));
      }

      setData("note", note);
    }
  });

  function backoff(attempt: number = 0) {
    const baseDelay = 2000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * (2 ** attempt), maxDelay);

    return setTimeout(async () => {
      const response = await syncService.syncPush();

      if (response.status === "error") {
        backoff(attempt + 1);
        return;
      }

      backoff(0);
    }, delay);
  }

  const backoffId = backoff();

  onCleanup(() => {
    clearTimeout(backoffId);
  });

  return (
    <DataContext.Provider value={
      [
        data,
        {
          folderService: {
            createFolder,
            updateFolder,
            deleteFolder
          },
          noteService: {
            createNote,
            updateContent,
            deleteNote,
            favoriteNote,
            unfavoriteNote,
            archiveNote,
            unarchiveNote,
            restoreNote
          }
        }
      ]
    }>
      {props.children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext) as DataContextType;