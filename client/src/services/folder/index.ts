import { adjustDate } from "@utilify/core";
import { StoreOperations } from "@context/indexedDB";
import { Folder } from "@entities/folder";
import NoteService from "@services/note";
import SyncService from "../sync";

export default class FolderService {
  private static instance: FolderService;
  private noteService: NoteService | null = null;
  private syncService: SyncService | null = null;
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

  public setSyncService(syncService: SyncService) {
    this.syncService = syncService;
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
    const id = await this.folderStore.add(new Folder({...folder}));
    await this.syncService?.createFolder({...folder, id: id as string});
    return id;
  }

  async updateFolder(folder: Folder) {
    await this.folderStore.put(folder);
    await this.syncService?.updateFolder(folder);
  }

  async restoreFolder(id: string) {
    const folder = await this.folderStore.get(id);
    folder.updated_at = new Date().toISOString();
    folder.deleted_at = null;
    await this.folderStore.put(folder);
    await this.syncService?.restoreFolder(id);
  }

  async deleteFolder(id: string) {
    const folder = await this.getFolderById(id);
    folder.updated_at = folder.deleted_at = new Date().toISOString();
    await this.folderStore.put(folder);

    const notes = await this.noteService!.getNotesByFolderId(folder.id);

    for (const note of notes) {
      await this.noteService?.deleteNote(note.id);
    }

    await this.syncService?.deleteFolder(id);
  }

  async cleanDeletedFolders() {
    const folders = await this.getDeletedFolders();

    for (const folder of folders) {
      const deletedAt = new Date(folder.deleted_at!);
      const deletedDate = adjustDate(deletedAt, 30, "days");
      const now = new Date();
      
      if(now > deletedDate) {
        await this.folderStore.delete(folder.id);
      }
    }

    await this.noteService!.cleanDeletedNotes();
  }
}