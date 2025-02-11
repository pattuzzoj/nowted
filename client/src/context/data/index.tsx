import { createContext, createEffect, onCleanup, onMount, ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";
import { sleep } from "@utilify/core";
import { useIndexedDB } from "@context/indexedDB";
import useToast from "@hooks/useToast";
import FolderService from "@services/folder";
import NoteService from "@services/note";
import SyncService from "@services/sync";
import { Folder, Note, SyncPending } from "@/types";

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
      createFolder: (newFolder: Partial<Folder>) => Promise<void>;
      updateFolder: (folder: Partial<Folder>) => Promise<void>;
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
  const folderStore = useStore<Folder>("folder");
  const noteStore = useStore<Note>("note");
  const syncStore = useStore<SyncPending>("syncPending");
  const folderService = FolderService.getInstance(folderStore);
  const noteService = NoteService.getInstance(noteStore);
  const syncService = SyncService.getInstance(syncStore);
  folderService.setNoteService(noteService);
  folderService.setSyncService(syncService);
  noteService.setFolderService(folderService);
  noteService.setSyncService(syncService);
  syncService.setFolderService(folderService);
  syncService.setNoteService(noteService);
  const params = useParams();
  const notify = useToast();

  onMount(async () => {
    if (!localStorage.getItem("lastSync")) {
      localStorage.setItem("lastSync", new Date("0").toISOString());
    }

    notify.loading("Synchronizing...");
    await sleep(1000);
    const response = await syncService.syncFetch();

    if (response.status === "error") {
      notify.error(response.message);
    } else {
      notify.success(response.message);
    }
    
    await sleep(1000);
    notify.loading("Loading local data...");
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

  async function getFolderById(id: string) {
    const folder = await folderService.getFolderById(id);
    setData("folder", folder);
  }

  async function getNoteById(id: string) {
    const note = await noteService.getNoteById(id);
    const recents = [...data.recents];
    recents.unshift(note);

    if (!data.recents.find((recentNote) => recentNote.id === note.id)) {
      setData("recents", recents.slice(0, 3));
    }
    
    setData("note", note);
  }

  async function getNotesByFolderId(id: string) {
    const notes = await noteService.getNotesByFolderId(id);
    setData("notes", notes);
  }

  async function createFolder(newFolder: Folder) {
    notify.loading("Creating Folder...");
    await sleep(1000);

    try {
      const folderId = await folderService.createFolder(newFolder);
      const folder = await folderService.getFolderById(folderId as string);

      setData("folders", (folders) => [
        ...folders,
        folder
      ]);

      notify.success("Folder created successfully");
    } catch (error) {
      notify.error("Could not created the folder");
    }
  }

  async function updateFolder(folder: Folder) {
    notify.loading("Updating Folder...");
    await sleep(1000);

    try {
      await folderService.updateFolder(folder);

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
      await folderService.deleteFolder(id);

      setData("folders", (folders) => [
        ...folders.filter((folder) => folder.id != id)
      ]);

      notify.success("Folder deleted successfully");
    } catch (error) {
      notify.error("Could not delete the folder");
    }
  }

  async function createNote(folderId: string) {
    notify.loading("Creating note...");
    await sleep(1000);

    try {
      const noteId = await noteService.createNote("new note", folderId);
      const note = await noteService.getNoteById(noteId as string);

      setData("notes", data.notes.length, note);

      notify.success("Note created successfully");
    } catch {
      notify.error("Error creating note");
    }
  }

  async function updateNote(note: Note) {
    await noteService.updateNote(note);

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
      const note = await noteService.getNoteById(id);
      note.preview = preview;
      note.content = content;
      await updateNote(note);

      notify.success("Content updated successfully");
    } catch {
      notify.error("Error updating content");
    }
  }

  async function favoriteNote(id: string) {
    notify.loading("Adding to favorites...");
    await sleep(1000);

    try {
      const note = await noteService.getNoteById(id);
      note.favorite = true;
      await updateNote(note);

      setData("favorites", data.favorites.length, note);

      notify.success("Note added to favorites");
    } catch {
      notify.error("Error adding note to favorites");
    }
  }

  async function unfavoriteNote(id: string) {
    notify.loading("Removing from favorites...");
    await sleep(1000);

    try {
      const note = await noteService.getNoteById(id);
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
      const note = await noteService.getNoteById(id);
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
      const note = await noteService.getNoteById(id);
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
      const note = await noteService.restoreNote(id);

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
      const note = await noteService.deleteNote(id);

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
      await getFolderById(params.folderId);
      await getNotesByFolderId(params.folderId);
    }
  });

  createEffect(async () => {
    if (params.noteId) {
      await getNoteById(params.noteId);
    }
  });

  const syncId = setInterval(() => {
    if (navigator.onLine) {
      syncService.syncPush();
    }
  }, 5000);

  onCleanup(() => clearInterval(syncId));

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