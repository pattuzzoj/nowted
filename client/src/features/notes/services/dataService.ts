import { SetStoreFunction } from "solid-js/store";
import { Notify } from "@/shared/utils/decorators/notify";
import { messages } from "@/shared/utils/messages";
import FolderService from "./folderService";
import NoteService from "./noteService";
import ActionRecordService from "./actionRecordService";
import type { Folder, Note } from "../types";

export interface UseCases {
  createFolder: (data: Folder) => Promise<void>;
  updateFolder: (data: Folder) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  createNote: (data: Note) => Promise<void>;
  updateNote: (data: Partial<Note>) => Promise<void>;
  favoriteNote: (id: string) => Promise<void>;
  unfavoriteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  unarchiveNote: (id: string) => Promise<void>;
  restoreNote: (id: string, folderId: string) => Promise<void>;
  moveNote: (id: string, folderId: string) => Promise<void>;
  trashNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export type ContextData = {
  folder: Folder;
  note: Note;
  recents: Note[];
  folders: Folder[];
  notes: Note[];
  favorites: Note[];
  archived: Note[];
  trash: Note[];
};

type Resource = Exclude<keyof ContextData, "folder" | "note">;

export default class DataService implements UseCases {
  private static instance: DataService;
  private folderService: FolderService;
  private noteService: NoteService;
  private actionRecordService: ActionRecordService;

  private constructor(
    private data: ContextData,
    private setData: SetStoreFunction<ContextData>,
  ) {
    this.folderService = FolderService.getInstance();
    this.noteService = NoteService.getInstance();
    this.actionRecordService = ActionRecordService.getInstance();
  }

  static getInstance(
    data: ContextData,
    setData: SetStoreFunction<ContextData>,
  ): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService(
        data,
        setData
      );
    }

    return DataService.instance;
  }

  private add(resource: Resource, item: any) {
    this.setData(resource, (items) => [item, ...items]);
  }

  private replace(resource: Resource, itemUpdated: any) {
    this.setData(resource, (items) =>
      items.map((item) => (item.id === itemUpdated.id ? itemUpdated : item))
    );
  }

  private remove(resource: Resource, id: string) {
    this.setData(resource, (items: any[]) =>
      items.filter((item) => item.id !== id)
    );
  }

  @Notify(messages.CREATE_FOLDER)
  public async createFolder(data: Folder) {
    const folder = await this.folderService.create(data);
    this.add("folders", folder);
    this.actionRecordService.create("create", "folder", folder);
  }

  @Notify(messages.UPDATE_FOLDER)
  public async updateFolder(data: Folder) {
    const folder = await this.folderService.update(data);

    if (this.data.folder.id === folder.id) {
      this.setData("folder", folder);
    }

    this.replace("folders", folder);
    this.actionRecordService.create("update", "folder", folder);
  }

  @Notify(messages.DELETE_FOLDER)
  public async deleteFolder(id: string) {
    const notes = await this.noteService.getNotesByFolderId(id);

    for (const note of notes) {
      await this.noteService.trash(note.id);
    }

    if (this.data.folder.id === id) {
      this.setData("folder", { id: "" });
      this.setData("notes", []);
    }

    await this.folderService.delete(id);
    this.setData("favorites", await this.noteService.getFavoriteNotes());
    this.setData("archived", await this.noteService.getArchivedNotes());
    this.setData("trash", await this.noteService.getDeletedNotes());
    this.remove("folders", id);
    this.actionRecordService.create("delete", "folder", {id});
  }

  @Notify(messages.CREATE_NOTE)
  public async createNote(data: Note) {
    data.folder_id = this.data.folder.id;
    const note = await this.noteService.create(data);
    this.add("notes", note);
    this.actionRecordService.create("create", "note", note);
  }

  @Notify(messages.UPDATE_NOTE)
  public async updateNote(data: Note) {
    const note = await this.noteService.update(data);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    const recents = [
      note,
      ...this.data.recents.filter((recent) => recent.id !== note.id),
    ];

    if (!this.data.recents.find((recentNote) => recentNote.id === note.id)) {
      this.setData("recents", recents.slice(0, 3));
    }

    this.replace("notes", note);
    this.replace("favorites", note);
    this.replace("archived", note);
    this.actionRecordService.create("update", "note", note);
  }

  @Notify(messages.FAVORITE_NOTE)
  public async favoriteNote(id: string) {
    const note = await this.noteService.favorite(id);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    this.add("favorites", note);
    this.replace("notes", note);
    this.replace("archived", note);
    this.actionRecordService.create("update", "note", note);
  }

  @Notify(messages.UNFAVORITE_NOTE)
  public async unfavoriteNote(id: string) {
    const note = await this.noteService.unfavorite(id);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    this.remove("favorites", note.id);
    this.replace("notes", note);
    this.replace("archived", note);
    this.actionRecordService.create("update", "note", note);
  }

  @Notify(messages.ARCHIVE_NOTE)
  public async archiveNote(id: string) {
    const note = await this.noteService.archive(id);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    this.remove("notes", note.id);
    this.add("archived", note);
    this.replace("favorites", note);
    this.actionRecordService.create("update", "note", note);
  }

  @Notify(messages.UNARCHIVE_NOTE)
  public async unarchiveNote(id: string) {
    const note = await this.noteService.unarchive(id);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    if (this.data.folder.id === note.folder_id) {
      this.add("notes", note);
    }

    this.replace("favorites", note);
    this.remove("archived", note.id);
    this.actionRecordService.create("update", "note", note);
  }

  @Notify(messages.RESTORE_NOTE)
  public async restoreNote(id: string, folderId: string) {
    const note = await this.noteService.restore(id);
    note.folder_id = folderId;
    await this.noteService.update(note);
    this.remove("trash", id);
    this.actionRecordService.create("restore", "note", note);
  }

  @Notify(messages.MOVE_NOTE)
  public async moveNote(id: string, folderId: string) {
    let note = await this.noteService.get(id);
    note.folder_id = folderId;
    note = await this.noteService.update(note);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
      const folder = await this.folderService.get(note.folder_id);
      this.setData("folder", folder);
      this.setData("notes", await this.noteService.getNotesByFolderId(note.folder_id));
    }

    this.replace("favorites", note);
    this.replace("archived", note);

    this.actionRecordService.create("update", "note", note);
  }

  @Notify(messages.TRASH_NOTE)
  public async trashNote(id: string) {
    const note = await this.noteService.trash(id);

    if (this.data.folder.id === this.data.note.folder_id) {
      this.remove("notes", note.id);
    }

    if (this.data.note.id === note.id) {
      this.setData("note", {id: ""});
    }

    this.remove("favorites", note.id);
    this.remove("archived", note.id);
    this.remove("recents", note.id);
    this.add("trash", note);
    this.actionRecordService.create("delete", "note", note);
  }

  @Notify(messages.DELETE_NOTE)
  public async deleteNote(id: string) {
    await this.noteService.delete(id);
    this.remove("trash", id);
  }
}
