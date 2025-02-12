import FetchService from "@services/fetch";
import { baseURL } from "@utils/constants";
import { StoreOperations } from "@/context/indexedDB";
import FolderService from "../folder";
import NoteService from "../note";
import { EntityType, Folder, Note, OperationType, SyncData, SyncRecord } from "@/types";

export default class SyncService {
  private static instance: SyncService;
  private syncStore: StoreOperations<SyncRecord>;
  private fetchService: FetchService = new FetchService(baseURL.concat("/sync"));
  private folderService: FolderService | null = null;
  private noteService: NoteService | null = null;

  private constructor(syncStore: StoreOperations<SyncRecord>) {
    this.syncStore = syncStore;
  }

  public static getInstance(syncStore: StoreOperations<SyncRecord>) {
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

    if (response.status === "error" || !("status" in response)) {
      return response;
    }
    
    try {
      await this.folderService?.populateFolder(response.data.folders);
      await this.noteService?.populateNote(response.data.notes);
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
    const recordsList = await this.syncStore.getAll();
    const response = await this.fetchService.post("", recordsList);

    if (response.status === "error" || !("status" in response)) {
      return response;
    }

    localStorage.setItem("lastSync", new Date(response.timestamp).toISOString());

    for (const item of recordsList) {
      await this.syncStore.delete(item.id);
    }

    return response;
  }

  public async createRecord(type: OperationType, entity: EntityType, data: SyncData) {
    await this.syncStore.add({
      id: crypto.randomUUID(),
      type,
      entity,
      data,
      timestamp: Date.now()
    })
  }

  public async createFolder(folder: Folder) {
    await this.createRecord("create", "folder", folder);
  }

  public async createNote(noteId: string, folderId: string) {
    await this.createRecord("create", "note", {
      id: noteId,
      folder_id: folderId
    });
  }

  public async updateFolder(data: SyncData) {
    await this.createRecord("update", "folder", data);
  }

  public async updateNote(data: SyncData) {
    await this.createRecord("update", "note", data);
  }

  public async deleteFolder(id: string) {
    await this.createRecord("delete", "folder", {id});
  }

  public async deleteNote(id: string) {
    await this.createRecord("delete", "note", {id});
  }

  public async restoreFolder(id: string) {
    await this.createRecord("restore", "folder", {id});
  }

  public async restoreNote(id: string) {
    await this.createRecord("restore", "note", {id});
  }
}