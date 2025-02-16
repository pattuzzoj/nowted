import { createContext, createEffect, onCleanup, onMount, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";
import { sleep } from "@utilify/core";
import { useIndexedDB } from "@context/indexedDB";
import useToast from "@hooks/useToast";
import FolderService from "@services/folder";
import NoteService from "@services/note";
import SyncService from "@services/sync";
import { ActionRecord, Folder, Note, SyncRecord } from "@/types";
import FetchService from "@/services/fetch";
import { baseURL } from "@/utils/constants";
import ActionRecordService from "@/services/actionRecord";
import { messages } from "@/utils/messages/index";

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
  const fetchService = new FetchService(baseURL.concat("/sync"));
  const syncService = SyncService.getInstance(fetchService, actionRecordService, folderService, noteService);
  const params = useParams();
  const notify = useToast();

  onMount(async () => {
    if (!localStorage.getItem("lastSync")) {
      localStorage.setItem("lastSync", new Date("0").toISOString());
    }

    notify.loading("Synchronizing...");
    const response = await syncService.syncFetch();
    await sleep(1000);

    if (response.status === "error") {
      notify.error(response.message);
    } else {
      notify.success(response.message);
    }
    
    await sleep(1000);
    notify.loading("Loading data...");
    await sleep(1000);

    try {
      const folders = await folderService.getFolders();
      const favorites = await noteService.getFavoriteNotes();
      const archived = await noteService.getArchivedNotes();
      const trash = await noteService.getDeletedNotes();

      setData("folders", folders);
      setData("favorites", favorites);
      setData("archived", archived);
      setData("trash", trash);

      notify.success("Data loaded successfully");
    } catch (error) {
      console.error(error);
      notify.error("Internal Error");
    }
  });

  async function createFolder(data: Folder) {
    messages.CREATE_FOLDER.loading

    const folder = await notify.promise(async () => {
      return await folderService.create(data);

    }, messages.CREATE_FOLDER);
    
    setData("folders", (folders) => [
      ...folders,
      folder
    ]);
  }

  async function updateFolder(folder: Folder) {
    notify.loading(messages.UPDATE_FOLDER.loading);
    await sleep(1000);

    try {
      await folderService.update(folder);

      setData("folders", (folders) => [
        ...folders.map((currentFolder) => {
          if (currentFolder.id === folder.id) {
            return folder;
          }

          return currentFolder;
        })
      ]);

      notify.success("Folder updated successfully");
    } catch {
      notify.error("Error updating folder");
    }
  }

  async function deleteFolder(id: string) {
    notify.loading("Deleting Folder...");
    await sleep(1000);

    try {
      await folderService.delete(id);
      const notes = await noteService.getNotesByFolderId(id);

      for (const note of notes) {
        await noteService.delete(note.id);
      }

      setData("folders", (folders) => [
        ...folders.filter((folder) => folder.id != id)
      ]);

      notify.success("Folder deleted successfully");
    } catch (error) {
      notify.error("Could not delete the folder");
    }
  }

  async function restoreFolder(id: string) {
    notify.loading("Restoring folder...");
    await sleep(1000);

    try {
      const folder = await folderService.get(id);
    
      if (folder.deleted_at !== null) {
        await folderService.restore(folder.id);
      }

      setData("folders", data.folders.length, folder);

      notify.success("Folder restored successfully");
    } catch {
      notify.error("Error restoring folder");
    }
  }

  async function createNote(folderId: string) {
    notify.loading("Creating note...");
    await sleep(1000);

    try {
      const note = await noteService.create({name: "new note", folder_id: folderId});

      setData("notes", data.notes.length, note);

      notify.success("Note created successfully");
    } catch {
      notify.error("Error creating note");
    }
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
    notify.loading("Updating content...");
    await sleep(1000);

    try {
      const note = await noteService.get(id);
      note.preview = preview;
      note.content = content;
      await updateNote(note);

      notify.success("Content updated successfully");
    } catch {
      notify.error("Error updating content");
    }
  }

  function favoriteNote(id: string) {
    notify.promise(async () => {
      await noteService.favorite(id);

      setData("favorites", data.favorites.length, note);
    }, messages.FAVORITE_NOTE)
  }

  async function unfavoriteNote(id: string) {
    notify.loading("Removing from favorites...");
    await sleep(1000);

    try {
      const note = await noteService.get(id);
      note.favorite = false;
      await updateNote(note);

      setData("favorites", (notes) => [
        ...(notes).filter((currentNote) => currentNote.id != note.id)
      ]);

      notify.success("Note removed from favorites");
    } catch {
      notify.error("Error removing note from favorites");
    }
  }

  async function archiveNote(id: string) {
    notify.loading("Archiving note...");
    await sleep(1000);

    try {
      const note = await noteService.get(id);
      note.archived = true;
      await updateNote(note);

      setData("notes", (notes) => [
        ...notes.filter((note) => note.id != id)
      ]);

      setData("archived", data.archived.length, note);

      notify.success("Note archived successfully");
    } catch {
      notify.error("Error archiving note");
    }
  }

  async function unarchiveNote(id: string) {
    notify.loading("Unarchiving note...");
    await sleep(1000);

    try {
      const note = await noteService.get(id);
      note.archived = false;
      await updateNote(note);

      setData("archived", (notes) => [
        ...(notes).filter((currentNote) => currentNote.id != note.id)
      ]);

      notify.success("Note unarchived successfully");
    } catch {
      notify.error("Error unarchiving note");
    }
  }

  async function restoreNote(id: string) {
    notify.loading("Restoring note...");
    await sleep(1000);

    try {
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
        const folders = await folderService.getFolders();
        setData("folders", folders);
      }

      notify.success("Note restored successfully");
    } catch {
      notify.error("Error restoring note");
    }
  }

  async function deleteNote(id: string) {
    notify.loading("Deleting note...");
    await sleep(1000);

    try {
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

      notify.success("Note deleted successfully");
    } catch {
      notify.error("Error deleting note");
    }
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
    const baseDelay = 1000;
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