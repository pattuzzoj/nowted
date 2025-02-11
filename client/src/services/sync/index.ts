import FetchService from "@services/fetch";
import { baseURL } from "@utils/constants";
import { SyncData } from "./interface/syncData.interface";
import { StoreOperations } from "@/context/indexedDB";
import { FolderService } from "../folder";
import { NoteService } from "../note";
import { Folder, Note } from "@/types/interfaces";

export default class SyncService {
  private static instance: SyncService;
  private syncStore: StoreOperations<SyncData>;
  private fetchService: FetchService = new FetchService(baseURL.concat("/sync"));
  private folderService: FolderService | null = null;
  private noteService: NoteService | null = null;

  private constructor(syncStore: StoreOperations<SyncData>) {
    this.syncStore = syncStore;
  }

  public static getInstance(syncStore: StoreOperations<SyncData>) {
    if (!this.instance) {
      SyncService.instance = new SyncService(syncStore);
    }

    return SyncService.instance;
  }

  public setFolderService(folderService: FolderService) {
    this.folderService = folderService;
  }

  public setNoteService(noteService: NoteService) {
    this.noteService = noteService;
  }

  async syncFetch() {
    const lastSync = localStorage.getItem("lastSync");
    const response = await this.fetchService.get<{folders: Folder[], notes: Note[]}>(`/${lastSync}`);

    if (response.status === "error") {
      return response;
    }
    
    try {
      for (const folder of response.data.folders) {
        await this.folderService?.updateFolder(folder)
      }

      for (const note of response.data.notes) {
        await this.noteService?.updateNote(note)
      }
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Internal Error",
        data: null
      }
    }

    localStorage.setItem("lastSync", response.timestamp!);
    return response;
  }

  async syncPush() {
    const pendingCount = await this.syncStore.count();

    if (pendingCount < 10) {
      return;
    }

    const syncPending = await this.syncStore.getAll();
    const syncData: {note: SyncData[], folder: SyncData[]} = {
      note: [],
      folder: []
    };
  
    for (const item of syncPending) {
      syncData[item.entity].push(item);
    }

    const response = await this.fetchService.post("", syncData);

    if (response.status === "error") {
      return response;
    }

    localStorage.setItem("lastSync", response.timestamp);

    for (const item of syncPending) {
      await this.syncStore.delete(item.id);
    }

    return;
  }
}