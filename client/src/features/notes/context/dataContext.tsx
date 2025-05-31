import {
  createContext,
  createEffect,
  createSignal,
  on,
  ParentProps,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { useLocation, useNavigate, useParams } from "@solidjs/router";
import useIndexedDB from "@/shared/hooks/useIndexedDB";
import FolderService from "../services/folderService";
import NoteService from "../services/noteService";
import SyncService from "../services/syncService";
import ActionRecordService from "../services/actionRecordService";
import DataService from "../services/dataService";
import type { ContextData, UseCases } from "../services/dataService";
import type { ActionRecord, Folder, Note } from "../types";
import { Length } from "class-validator";

export type DataContextType = [data: ContextData, services: UseCases];

export const DataContext = createContext<DataContextType>();

export default function DataContextProvider(props: ParentProps) {
  const [data, setData] = createStore<ContextData>({
    context: "",
    folder: {} as Folder,
    note: {} as Note,
    folders: [],
    notes: [],
    recents: [],
    favorites: [],
    archived: [],
    trash: [],
  });
  const [useStore] = useIndexedDB();
  const folderStore = useStore<Folder>("folder");
  const noteStore = useStore<Note>("note");
  const ActionRecordStore = useStore<ActionRecord>("action-record");
  FolderService.initialize(folderStore);
  NoteService.initialize(noteStore);
  ActionRecordService.initialize(ActionRecordStore);
  const folderService = FolderService.getInstance();
  const noteService = NoteService.getInstance();
  const dataService = DataService.getInstance(data, setData);
  const syncService = SyncService.getInstance();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = () => location.pathname;
  const [hasLoadedGlobals, setHasLoadedGlobals] = createSignal(false);

  createEffect(
    on(pathname, async (path) => {
      if (!hasLoadedGlobals()) {
        setData("folders", await folderService.getAllFolders());
        setData("favorites", await noteService.getFavoriteNotes());
        setData("archived", await noteService.getArchivedNotes());
        setData("trash", await noteService.getTrashNotes());

        setHasLoadedGlobals(true);
      }

      const { folderId, noteId } = params;

      await loadNote(noteId);

      let notes = [];

      if (path.startsWith("/folder") && folderId) {
        await loadFolder(folderId);
      } else if (path.startsWith("/favorites")) {
        notes = await noteService.getAllNotes([...data.favorites]);
        setData("notes", notes);
      } else if (path.startsWith("/archived")) {
        notes = await noteService.getAllNotes([...data.archived]);
        setData("notes", notes);
      } else if (path.startsWith("/trash")) {
        notes = await noteService.getAllNotes([...data.trash]);
        setData("notes", notes);
      } else {
        setData("notes", []);
      }
    })
  );

  async function loadNote(noteId: string | undefined) {
    if (noteId) {
      const hasNote = await noteService.hasNote(noteId);

      if (!hasNote) {
        navigate("/");
        return;
      }

      const note = await noteService.getNote(noteId);
      const hasFolder = await folderService.hasFolder(note.folder_id);

      if (hasFolder && note.folder_id !== data.folder.id) {
        const folder = await folderService.getFolder(note.folder_id);
        setData("folder", folder);
      }

      setData("note", note);
    } else {
      setData("note", reconcile({} as Note));
    }
  }

  async function loadFolder(folderId: string) {
    if (folderId) {
      const hasFolder = await folderService.hasFolder(folderId);

      if (!hasFolder) {
        navigate("/");
        return;
      }

      const folder = await folderService.getFolder(folderId);
      const notes = await noteService.getNotesByFolderId(folderId);
      const activeNotes = notes.filter((note) => !note.archived);

      setData("folder", folder);
      setData("notes", reconcile(activeNotes));
    } else {
      setData("folder", reconcile({} as Folder));
    }
  }

  async function setContext(
    context: "" | "folder" | "favorites" | "archived" | "trash"
  ) {
    setData("context", context);
  }

  createEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes("folder")) {
      setContext("folder");
    } else if (pathname.includes("favorites")) {
      setContext("favorites");
    } else if (pathname.includes("archived")) {
      setContext("archived");
    } else if (pathname.includes("trash")) {
      setContext("trash");
    } else {
      setContext("");
    }
  });

  async function moveNote(id: string, folderId: string) {
    await dataService.moveNote(id, folderId);

    if (params.folderId) {
      navigate(`/folder/${folderId}/note/${id}`);
    }
  }

  // function backoff(attempt: number = 0) {
  //   const baseDelay = 2000;
  //   const maxDelay = 30000;
  //   const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);

  //   return setTimeout(async () => {
  //     const response = await syncService.syncPush();

  //     if (response.status === "error") {
  //       backoff(attempt + 1);
  //       return;
  //     }

  //     backoff(0);
  //   }, delay);
  // }

  return (
    <DataContext.Provider
      value={[
        data,
        {
          setContext,
          // folder
          createFolder: dataService.createFolder.bind(dataService),
          updateFolder: dataService.updateFolder.bind(dataService),
          deleteFolder: dataService.deleteFolder.bind(dataService),
          // note
          createNote: dataService.createNote.bind(dataService),
          updateNote: dataService.updateNote.bind(dataService),
          favoriteNote: dataService.favoriteNote.bind(dataService),
          unfavoriteNote: dataService.unfavoriteNote.bind(dataService),
          archiveNote: dataService.archiveNote.bind(dataService),
          unarchiveNote: dataService.unarchiveNote.bind(dataService),
          restoreNote: dataService.restoreNote.bind(dataService),
          moveNote,
          trashNote: dataService.trashNote.bind(dataService),
          deleteNote: dataService.deleteNote.bind(dataService),
        },
      ]}
    >
      {props.children}
    </DataContext.Provider>
  );
}
