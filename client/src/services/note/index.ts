import { adjustDate } from "@utilify/core";
import { StoreOperations } from "@context/indexedDB";
import { Note } from "@entities/note";
import ActionRecordService from "@services/actionRecord";

export default class NoteService {
  private static instance: NoteService;

  private constructor(
    private noteStore: StoreOperations<Note>,
    private actionRecordService: ActionRecordService
  ) {}

  public static getInstance(
    noteStore: StoreOperations<Note>,
    actionRecordService: ActionRecordService
  ) {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService(noteStore, actionRecordService);
    }

    return NoteService.instance;
  }

  async get(id: string) {
    return await this.noteStore.get(id);
  }

  async getAll() {
    return await this.noteStore.getAll();
  }

  async getNotesByFolderId(folderId: string) {
    const notes = await this.getAll();
    return notes.filter((note) =>
        note.folder_id === folderId &&
        note.archived === false &&
        note.deleted_at === null
    );
  }

  async getFavoriteNotes() {
    const notes = await this.getAll();
    return notes.filter((note) => note.favorite && note.deleted_at === null);
  }

  async getArchivedNotes() {
    const notes = await this.getAll();
    return notes.filter((note) => note.archived && note.deleted_at === null);
  }

  async getDeletedNotes() {
    const notes = await this.getAll();
    return notes.filter((note) => note.deleted_at !== null);
  }

  async populate(notes: Note[]) {
    for (const note of notes) {
      await this.noteStore.put(note);
    }
  }

  async create(data: Note) {
    const note = new Note(data.name, data.folder_id);
    await this.noteStore.add(note);
    await this.actionRecordService.create("create", "note", note);

    return note;
  }

  async update(note: Note) {
    note.updated_at = new Date().toISOString();
    await this.noteStore.put(note);
    await this.actionRecordService.create("update", "note", note);
  }

  async favorite(id: string) {
    const note = await this.noteStore.get(id);
    note.favorite = true;
    await this.update(note);
  }

  async unfavorite(id: string) {
    const note = await this.noteStore.get(id);
    note.favorite = false;
    await this.update(note);
  }

  async archive(id: string) {
    const note = await this.noteStore.get(id);
    note.archived = true;
    await this.update(note);
  }

  async unarchive(id: string) {
    const note = await this.noteStore.get(id);
    note.archived = false;
    await this.update(note);
  }

  async delete(id: string) {
    const note = await this.noteStore.get(id);
    note.updated_at = note.deleted_at = new Date().toISOString();
    await this.noteStore.put(note);

    await this.actionRecordService.create("delete", "note", {
      id: note.id,
      updated_at: note.updated_at,
      deleted_at: note.deleted_at
    });
  }

  async restore(id: string) {
    const note = await this.noteStore.get(id);
    note.deleted_at = null;
    await this.update(note);
    note.updated_at = new Date().toISOString();
    await this.noteStore.put(note);

    await this.actionRecordService.create("restore", "note", {
      id: note.id,
      updated_at: note.updated_at,
      deleted_at: note.deleted_at
    });
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
