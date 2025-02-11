import { adjustDate } from "@utilify/core";
import { StoreOperations } from "@context/indexedDB";
import { Note } from "@entities/note";
import { FolderService } from "@services/folder";

export class NoteService {
  private static instance: NoteService;
  private folderService: FolderService | null = null;
  private noteStore: StoreOperations<Note>;

  private constructor(noteStore: StoreOperations<Note>) {
    this.noteStore = noteStore;
  }

  public static getInstance(noteStore: StoreOperations<Note>) {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService(noteStore);
    }

    return NoteService.instance;
  }

  public setFolderService(folderService: FolderService) {
    this.folderService = folderService;
  }

  async getNoteById(id: string) {
    return await this.noteStore.get(id);
  }

  async getNotes() {
    return await this.noteStore.getAll();
  }

  async getNotesByFolderId(folderId: string) {
    return (await this.noteStore.getAll()).filter((note) => (note.folder_id === folderId && note.archived === false && note.deleted_at === null));
  }

  async getFavoriteNotes() {
    return (await this.noteStore.getAll()).filter((note) => (note.favorite && note.deleted_at === null));
  }

  async getArchivedNotes() {
    return (await this.noteStore.getAll()).filter((note) => (note.archived && note.deleted_at === null));
  }

  async getDeletedNotes() {
    return (await this.noteStore.getAll()).filter((note) => note.deleted_at !== null);
  }

  async createNote(name: string, folderId: string) {
    return await this.noteStore.add(new Note(name, folderId));
  }

  async updateNote(note: Note) {
    await this.noteStore.put(note);
  }

  async restoreNote(id: string) {
    const note = await this.noteStore.get(id);
    note.updated_at = new Date().toISOString();
    note.deleted_at = null;
    await this.noteStore.put(note);

    const folder = await this.folderService!.getFolderById(note.folder_id);
    
    if (folder.deleted_at !== null) {
      await this.folderService!.restoreFolder(folder.id);
    }

    return note;
  }

  async deleteNote(id: string) {
    const note = await this.noteStore.get(id);
    note.updated_at = note.deleted_at = new Date().toISOString();
    await this.noteStore.put(note);

    return note;
  }

  async cleanDeletedNotes() {
    const notes = await this.getDeletedNotes();

    for (const note of notes) {
      const deletedAt = new Date(note.deleted_at!);
      const deletedDate = adjustDate(deletedAt, 30, "days");
      const now = new Date();
      
      if(now > deletedDate) {
        await this.noteStore.delete(note.id);
      }
    }
  }
}