import FetchService from "@services/fetch";
import { baseURL } from "@utils/constants";
import { StoreOperations } from "@/context/indexedDB";
import FolderService from "../folder";
import NoteService from "../note";
import { EntityType, Folder, Note, OperationType, SyncData, SyncPending } from "@/types";

export default class SyncService {
  private static instance: SyncService;
  private syncStore: StoreOperations<SyncPending>;
  private fetchService: FetchService = new FetchService(baseURL.concat("/sync"));
  private folderService: FolderService | null = null;
  private noteService: NoteService | null = null;

  private constructor(syncStore: StoreOperations<SyncPending>) {
    this.syncStore = syncStore;
  }

  public static getInstance(syncStore: StoreOperations<SyncPending>) {
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
        await this.folderService?.updateFolder(folder);
      }

      for (const note of response.data.notes) {
        await this.noteService?.updateNote(note);
      }
    } catch (error) {
      return {
        status: "error",
        message: "Internal Error",
        data: null
      }
    }

    localStorage.setItem("lastSync", new Date(response.timestamp!).toISOString());
    return response;
  }

  async syncPush() {
    const syncPending = await this.syncStore.getAll();
    // const syncData: {note: SyncData[], folder: SyncData[]} = {
    //   note: [],
    //   folder: []
    // };
  
    // for (const item of syncPending) {
    //   syncData[item.entity].push(item);
    // }

    const response = await this.fetchService.post("", syncPending);

    if (response.status === "error") {
      return response;
    }

    localStorage.setItem("lastSync", new Date(response.timestamp).toISOString());

    for (const item of syncPending) {
      await this.syncStore.delete(item.id);
    }

    return;
  }

  public async createPending(type: OperationType, entity: EntityType, data: SyncData) {
    await this.syncStore.add({
      id: crypto.randomUUID(),
      type,
      entity,
      data,
      timestamp: Date.now()
    })
  }

  public async createFolder(folder: Folder) {
    await this.createPending("create", "folder", folder);
  }

  public async createNote(noteId: string, folderId: string) {
    await this.createPending("create", "note", {
      id: noteId,
      folder_id: folderId
    });
  }

  public async updateFolder(data: SyncData) {
    await this.createPending("update", "folder", data);
  }

  public async updateNote(data: SyncData) {
    await this.createPending("update", "note", data);
  }

  public async deleteFolder(id: string) {
    await this.createPending("delete", "folder", {id});
  }

  public async deleteNote(id: string) {
    await this.createPending("delete", "note", {id});
  }

  public async restoreFolder(id: string) {
    await this.createPending("restore", "folder", {id});
  }

  public async restoreNote(id: string) {
    await this.createPending("restore", "note", {id});
  }
}