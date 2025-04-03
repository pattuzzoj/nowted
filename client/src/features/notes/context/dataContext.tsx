import { createContext, createEffect, onMount, ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate, useParams } from "@solidjs/router";
import useIndexedDB from "@/shared/hooks/useIndexedDB";
import FolderService from "../services/folderService";
import NoteService from "../services/noteService";
import SyncService from "../services/syncService";
import ActionRecordService from "../services/actionRecordService";
import DataService from "../services/dataService";
import type { ContextData, UseCases } from "../services/dataService";
import type { ActionRecord, Folder, Note } from "../types";

export type DataContextType = [
  data: ContextData,
  services: UseCases
]

export const DataContext = createContext<DataContextType>();

export default function DataContextProvider(props: ParentProps) {
  const [data, setData] = createStore<ContextData>({
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

  (async () => {
    setData("folders", await folderService.getAll());
    setData("favorites", await noteService.getFavoriteNotes());
    setData("archived", await noteService.getArchivedNotes());
    setData("trash", await noteService.getDeletedNotes());
  })();

  onMount(async () => {
    try {
      await syncService.syncFetch();
      setData("folders", await folderService.getAll());
      setData("favorites", await noteService.getFavoriteNotes());
      setData("archived", await noteService.getArchivedNotes());
      setData("trash", await noteService.getDeletedNotes());
    } catch (error) {}
  });

  async function moveNote(id: string, folderId: string) {
    await dataService.moveNote(id, folderId);

    if (params.folderId) {
      navigate(`/folder/${folderId}/note/${id}`);
    }
  }
  
  createEffect(async () => {
    if (params.folderId) {
      const folder = await folderService.get(params.folderId);
      const notes = await noteService.getNotesByFolderId(params.folderId);

      setData("folder", folder);
      setData("notes", notes);
    } else {
      setData("folder", { id: "" });
      setData("notes", []);
    }
  });

  createEffect(async () => {
    if (params.noteId) {
      const note = await noteService.get(params.noteId);
      const folder = await folderService.get(note.folder_id);

      if (params.folderId && params.folderId !== note.folder_id) {
        navigate("/folder/" + params.folderId);
        return;
      }

      if (folder) {
        setData("folder", folder);
      }

      setData("note", note);
    } else {
      setData("note", { id: "" });
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

  // const backoffId = backoff();

  // onCleanup(() => {
  //   clearTimeout(backoffId);
  // });

  return (
    <DataContext.Provider value={
      [
        data,
        {
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
        }
      ]
    }>
      {props.children}
    </DataContext.Provider>
  )
}
