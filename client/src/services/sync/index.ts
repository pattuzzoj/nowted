import { FolderService } from "@services/folder";
import { NoteService } from "@services/note";
import FetchService from "@services/fetch";
import type { Folder, Note } from "@types/interfaces";
import { baseURL } from "@utils/constants";
import { SyncData } from "./interfaces";

export default class SyncService {
  private static instance: SyncService;
  private noteService: NoteService | null = null;
  private folderService: FolderService | null = null;
  private fetchService: FetchService = new FetchService(baseURL.concat("/sync"));

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      SyncService.instance = new SyncService();
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
    const response = await this.fetchService.get<{folders: Folder[], notes: Note[], lastSync: string}>(`/${lastSync}`);

    if (response.status === "error" || response.data === null) {
      return response;
    }

    localStorage.setItem("lastSync", response.data.lastSync);

    try {
      response.data.folders.forEach(async (folder) => await this.folderService?.updateFolder(folder));
      response.data.notes.forEach(async (note) => await this.noteService?.updateNote(note));
      return response;
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Internal Error",
        data: null
      }
    }
  }

  async syncPush() {
    const lastSync = new Date(localStorage.getItem("lastSync")!);

    const folders = (await this.folderService?.getAllFolders())!.filter((folder) => (
      new Date(folder.updated_at) > lastSync
    ));
    const notes = (await this.noteService?.getNotes())!.filter((note) => (
      new Date(note.updated_at) > lastSync
    ));

    const data: SyncData = {
      folders,
      notes,
      lastSync: lastSync.toISOString()
    };

    if (notes.length > 0 || folders.length > 0) {
      return {
        status: "success",
        message: ""
      };
    }

    const response = await this.fetchService.post("", data);

    if (response.status === "error" || response.data === null) {
      return response;
    }

    localStorage.setItem("lastSync", response.data.lastSync);
  }
}