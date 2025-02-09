import { FolderService } from "services/folder";
import { NoteService } from "services/note";
import { Folder, Note } from "types/interfaces";
import { baseURL } from "utils/constants";
import { SyncData } from "./interfaces";

export default class SyncService {
  private static instance: SyncService;
  private static url: string = baseURL.concat("/sync");
  private folderService: FolderService | null = null;
  private noteService: NoteService | null = null;

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

  private static async request(endpoint: string, method: "GET" | "POST" | "DELETE", body?: Record<string, any>) {
    try {
      const request = await fetch(SyncService.url.concat(endpoint), {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        mode: 'cors',
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined
      });

      if (request.ok) {
        return await request.json();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async syncFetch() {
    const lastSync = localStorage.getItem("lastSync");

    const data = await SyncService.request(`/${lastSync}`, "GET") as {notes: Note[], folders: Folder[], lastSync: string};
    localStorage.setItem("lastSync", data.lastSync);
    
    if (data.folders.length) {
      data.folders.forEach(async (folder) => await this.folderService?.updateFolder(folder));
    }

    if (data.notes.length) {
      data.notes.forEach(async (note) => await this.noteService?.updateNote(note));
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
      const result = await SyncService.request("", "POST", data);
      localStorage.setItem("lastSync", result.lastSync);
    }
  }
}