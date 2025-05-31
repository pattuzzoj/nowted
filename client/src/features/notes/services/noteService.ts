import { adjustDate } from "@utilify/core";
import type { StoreOperations } from "@/shared/context/indexedDB";
import { Note } from "../entities/note";

export interface INoteService {
  seedSyncNotes(notes: Note[]): Promise<void>;
  hasNote(id: string): Promise<boolean>;
  getNote(id: string): Promise<Note>;
  getAllNotes(ids: string[]): Promise<Note[]>;
  getNotesByFolderId(folderId: string): Promise<Note[]>;
  getFavoriteNotes(): Promise<string[]>;
  getArchivedNotes(): Promise<string[]>;
  getTrashNotes(): Promise<string[]>;
  createNote(data: Note): Promise<Note>;
  updateNote(data: Note): Promise<Note>;
  favoriteNote(id: string): Promise<Note>;
  unfavoriteNote(id: string): Promise<Note>;
  archiveNote(id: string): Promise<Note>;
  unarchiveNote(id: string): Promise<Note>;
  restoreNote(id: string, folder_id: string): Promise<Note>;
  moveNote(id: string, folderId: string): Promise<Note>;
  trashNote(id: string): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  emptyTrash(): Promise<void>;
  emptyNoteStore(): Promise<void>;
}

export default class NoteService implements INoteService {
  private static instance: NoteService;

  private constructor(private noteStore: StoreOperations<Note>) {}

  static getInstance() {
    return NoteService.instance;
  }

  static initialize(noteStore: StoreOperations<Note>) {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService(noteStore);
    }

    return NoteService.instance;
  }

  private sortNotes(notes: Note[]) {
    return notes.sort((note, nextNote) => {
      return (
        new Date(note.updated_at).getTime() -
        new Date(nextNote.updated_at).getTime()
      );
    });
  }

  async seedSyncNotes(notes: Note[]) {
    for (const note of notes) {
      await this.noteStore.put(note);
    }
  }

  async hasNote(id: string) {
    const key = await this.noteStore.getKey(id);
    return Boolean(key);
  }

  async getNote(id: string) {
    return await this.noteStore.get(id);
  }

  async getAllNotes(ids: string[]): Promise<Note[]> {
    const notes = await this.noteStore.openCursor((cursor) =>
      ids.includes(cursor.value.id) ? cursor.value : undefined
    );

    return this.sortNotes(notes);
  }

  async getNotesByFolderId(folderId: string) {
    const notes = await this.noteStore.openCursor(
      (cursor) => ({ ...cursor.value, content: "" }),
      {
        index: "parent_folder",
        query: folderId,
      }
    );

    return this.sortNotes(notes);
  }

  async getFavoriteNotes() {
    return (await this.noteStore.openCursor((cursor) =>
      cursor.value.favorite ? cursor.value.id : undefined
    )) as unknown as string[];
  }

  async getArchivedNotes() {
    return (await this.noteStore.openCursor((cursor) =>
      cursor.value.archived ? cursor.value.id : undefined
    )) as unknown as string[];
  }

  async getTrashNotes() {
    return (await this.noteStore.openCursor((cursor) =>
      cursor.value.deleted_at ? cursor.value.id : undefined
    )) as unknown as string[];
  }

  async createNote(data: Note) {
    const note = new Note(data.name, data.folder_id);
    await this.noteStore.add(note);

    return note;
  }

  async updateNote(note: Note) {
    note.updated_at = new Date().toISOString();
    await this.noteStore.put(note);

    return note;
  }

  async favoriteNote(id: string) {
    let note = await this.getNote(id);
    note.favorite = true;
    note = await this.updateNote(note);

    return note;
  }

  async unfavoriteNote(id: string) {
    let note = await this.getNote(id);
    note.favorite = false;
    note = await this.updateNote(note);

    return note;
  }

  async archiveNote(id: string) {
    let note = await this.getNote(id);
    note.archived = true;
    note = await this.updateNote(note);

    return note;
  }

  async unarchiveNote(id: string) {
    let note = await this.getNote(id);
    note.archived = false;
    note = await this.updateNote(note);

    return note;
  }

  async trashNote(id: string) {
    let note = await this.getNote(id);
    note.folder_id = "";
    note.favorite = note.archived = false;
    note.updated_at = note.deleted_at = new Date().toISOString();
    await this.noteStore.put(note);

    return note;
  }

  async moveNote(id: string, folderId: string) {
    let note = await this.getNote(id);
    note.folder_id = folderId;
    note = await this.updateNote(note);

    return note;
  }

  async restoreNote(id: string, folderId: string) {
    let note = await this.getNote(id);
    note.deleted_at = null;
    note.folder_id = folderId;
    note = await this.updateNote(note);

    return note;
  }

  async deleteNote(id: string) {
    await this.noteStore.delete(id);
  }

  async emptyTrash() {
    const trashNotes = await this.getTrashNotes();
    const notes = await this.getAllNotes(trashNotes);

    for (const note of notes) {
      const deletedAt = new Date(note.deleted_at!);
      const deletedDate = adjustDate(deletedAt, 7, "days");
      const now = new Date();

      if (now > deletedDate) {
        await this.noteStore.delete(note.id);
      }
    }
  }

  async emptyNoteStore() {
    await this.noteStore.clear();
  }
}
