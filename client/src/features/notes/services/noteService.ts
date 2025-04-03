import { adjustDate } from "@utilify/core";
import type { StoreOperations } from "@/shared/context/indexedDB";
import { Note } from "../entities/note";

export interface INoteService {
  get(id: string): Promise<Note>;
  getAll(): Promise<Note[]>;
  getNotesByFolderId(folderId: string): Promise<Note[]>;
  getFavoriteNotes(): Promise<Note[]>;
  getArchivedNotes(): Promise<Note[]>;
  getDeletedNotes(): Promise<Note[]>;
  create(note: Note): Promise<Note>;
  update(note: Note): Promise<Note>;
  trash(id: string): Promise<Note>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<Note>;
  favorite(id: string): Promise<Note>;
  unfavorite(id: string): Promise<Note>;
  archive(id: string): Promise<Note>;
  unarchive(id: string): Promise<Note>;
  clear(): Promise<void>;
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

  async get(id: string) {
    return await this.noteStore.get(id);
  }

  async getAll() {
    const notes = (await this.noteStore.getAll())
    .sort((note, nextNote) => new Date(note.updated_at).getDate() - new Date(nextNote.updated_at).getDate());

    return notes;
  }

  async getNotesByFolderId(folderId: string) {
    const notes = (await this.noteStore.openCursor((cursor) => {
      if (cursor.value.archived === false && cursor.value.deleted_at === null) {
        return {...cursor.value, content: ""};
      }
    }, {index: "parent_folder", query: folderId}))
    .sort((note, nextNote) => new Date(note.updated_at).getDate() - new Date(nextNote.updated_at).getDate());

    return notes;
  }

  async getFavoriteNotes() {
    const notes = (await this.noteStore.openCursor((cursor) => {
      if (cursor.value.favorite) {
        return {...cursor.value, content: ""};
      }
    }))
    .sort((note, nextNote) => new Date(note.updated_at).getDate() - new Date(nextNote.updated_at).getDate());

    return notes;
  }

  async getArchivedNotes() {
    const notes = (await this.noteStore.openCursor((cursor) => {
      if (cursor.value.archived) {
        return {...cursor.value, content: ""};
      }
    }))
    .sort((note, nextNote) => new Date(note.updated_at).getDate() - new Date(nextNote.updated_at).getDate());

    return notes;
  }

  async getDeletedNotes() {
    const notes = (await this.noteStore.openCursor((cursor) => {
      if (cursor.value.deleted_at !== null) {
        return {...cursor.value, content: ""};
      }
    }))
    .sort((note, nextNote) => new Date(note.updated_at).getDate() - new Date(nextNote.updated_at).getDate());

    return notes;
  }

  async populate(notes: Note[]) {
    for (const note of notes) {
      await this.noteStore.put(note);
    }
  }

  async create(data: Note) {
    const note = new Note(data.name, data.folder_id);
    await this.noteStore.add(note);

    return note;
  }

  async update(note: Note) {
    note.updated_at = new Date().toISOString();
    await this.noteStore.put(note);

    return note;
  }

  async favorite(id: string) {
    let note = await this.get(id);
    note.favorite = true;
    note = await this.update(note);

    return note;
  }

  async unfavorite(id: string) {
    let note = await this.get(id);
    note.favorite = false;
    note = await this.update(note);

    return note;
  }

  async archive(id: string) {
    let note = await this.get(id);
    note.archived = true;
    note = await this.update(note);

    return note;
  }

  async unarchive(id: string) {
    let note = await this.get(id);
    note.archived = false;
    note = await this.update(note);

    return note;
  }
  
  async trash(id: string) {
    let note = await this.get(id);
    note.favorite = note.archived = false;
    note.deleted_at = new Date().toISOString();
    note.folder_id = "";
    note = await this.update(note);

    return note;
  }
  
  async restore(id: string) {
    let note = await this.get(id);
    note.deleted_at = null;
    note = await this.update(note);

    return note;
  }
  
  async delete(id: string) {
    await this.noteStore.delete(id);
  }

  async clear() {
    await this.noteStore.clear();
  }

  async cleanTrash() {
    const notes = await this.getDeletedNotes();

    for (const note of notes) {
      const deletedAt = new Date(note.deleted_at!);
      const deletedDate = adjustDate(deletedAt, 7, "days");
      const now = new Date();

      if (now > deletedDate) {
        await this.noteStore.delete(note.id);
      }
    }
  }
}
