import { adjustDate } from "@utilify/core";
import { StoreOperations } from "context/indexedDB";
import { Folder } from "entities/folder";
import { NoteService } from "services/note";

export class FolderService {
  private static instance: FolderService;
  private noteService: NoteService | null = null;
  private folderStore: StoreOperations<Folder>;

  private constructor(folderStore: StoreOperations<Folder>) {
    this.folderStore = folderStore;
  }

  public static getInstance(folderStore: StoreOperations<Folder>) {
    if(!FolderService.instance) {
      FolderService.instance = new FolderService(folderStore);
    }

    return FolderService.instance;
  }

  public setNoteService(noteService: NoteService) {
    this.noteService = noteService;
  }

  async getFolderById(id: string) {
    return await this.folderStore.get(id);
  }

  async getAllFolders() {
    return await this.folderStore.getAll();
  }

  async getFolders() {
    return (await this.folderStore.getAll()).filter((folder) => folder.deleted_at === null);
  }

  async getDeletedFolders() {
    return (await this.getFolders()).filter((folder) => folder.deleted_at !== null);
  }

  async createFolder(folder: Folder) {
    return await this.folderStore.add(new Folder({...folder})); 
  }

  async updateFolder(folder: Folder) {
    await this.folderStore.put(folder);
  }

  async restoreFolder(id: string) {
    const folder = await this.folderStore.get(id);
    folder.updated_at = (new Date()).toISOString();
    folder.deleted_at = null;
    await this.folderStore.put(folder);
  }

  async deleteFolder(id: string) {
    const folder = await this.getFolderById(id);
    folder.updated_at = folder.deleted_at = (new Date()).toISOString();
    await this.folderStore.put(folder);

    const notes = await this.noteService!.getNotesByFolderId(folder.id);

    for (const note of notes) {
      await this.noteService?.deleteNote(note.id);
    }
  }

  async cleanDeletedFolders() {
    const folders = await this.getDeletedFolders();

    for (const folder of folders) {
      const deletedAt = new Date(folder.deleted_at as string);
      const deletedDate = adjustDate(deletedAt, 30, "days");
      const now = new Date();
      
      if(now > deletedDate) {
        await this.folderStore.delete(folder.id);
      }
    }

    await this.noteService!.cleanDeletedNotes();
  }
}