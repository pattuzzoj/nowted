import { reconcile, SetStoreFunction } from "solid-js/store";
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
  updateNote: (data: Note) => Promise<void>;
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
  context: "" | "folder" | "favorites" | "archived" | "trash";
  folder: Folder;
  note: Note;
  recents: Note[];
  folders: Folder[];
  notes: Note[];
  favorites: string[];
  archived: string[];
  trash: string[];
};

type Resource = Exclude<keyof ContextData, "folder" | "note" | "context">;

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
    if (resource === "favorites" || resource === "archived" || resource === "trash") {
      this.setData(resource, (items: any[]) =>
        items.filter((item) => item !== id)
      );
    } else {
      this.setData(resource, (items: any[]) =>
        items.filter((item) => item.id !== id)
      );
    }
  }

  @Notify(messages.CREATE_FOLDER)
  public async createFolder(data: Folder) {
    const folder = await this.folderService.createFolder(data);
    await this.actionRecordService.add("folder", folder);
    this.add("folders", folder);
  }

  @Notify(messages.UPDATE_FOLDER)
  public async updateFolder(data: Folder) {
    const folder = await this.folderService.updateFolder(data);
    await this.actionRecordService.update("folder", folder);

    if (this.data.folder.id === folder.id) {
      this.setData("folder", folder);
    }

    this.replace("folders", folder);
  }

  @Notify(messages.DELETE_FOLDER)
  public async deleteFolder(id: string) {
    const notes = await this.noteService.getNotesByFolderId(id);
    await this.actionRecordService.trash("folder", {id});
    
    for (const note of notes) {
      await this.noteService.trashNote(note.id);
    }
    
    if (this.data.folder.id === id) {
      this.setData("folder", reconcile({} as Folder));
      this.setData("notes", []);
    }
    
    await this.folderService.deleteFolder(id);
    this.setData("favorites", await this.noteService.getFavoriteNotes());
    this.setData("archived", await this.noteService.getArchivedNotes());
    this.setData("trash", await this.noteService.getTrashNotes());
    this.remove("folders", id);
  }

  @Notify(messages.CREATE_NOTE)
  public async createNote(data: Note) {
    data.folder_id = this.data.folder.id;
    const note = await this.noteService.createNote(data);
    await this.actionRecordService.add("note", note);
    this.add("notes", note);
  }

  @Notify(messages.UPDATE_NOTE)
  public async updateNote(data: Note) {
    const note = await this.noteService.updateNote(data);
    await this.actionRecordService.update("note", note);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    const recents = [
      note,
      ...this.data.recents.filter((recent) => recent.id !== note.id),
    ];

    this.setData("recents", recents.slice(0, 3));
    this.replace("notes", note);
  }
  
  @Notify(messages.FAVORITE_NOTE)
  public async favoriteNote(id: string) {
    const note = await this.noteService.favoriteNote(id);
    await this.actionRecordService.update("note", note);

    if (this.data.note.id === id) {
      this.setData("note", note);
    }

    this.replace("notes", note);
    this.add("favorites", note.id);
  }

  @Notify(messages.UNFAVORITE_NOTE)
  public async unfavoriteNote(id: string) {
    const note = await this.noteService.unfavoriteNote(id);
    await this.actionRecordService.update("note", note);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    this.remove("favorites", note.id);
    
    if (this.data.context === "favorites") {
      this.remove("notes", note.id);
    } else {
      this.replace("notes", note);
    }
  }

  @Notify(messages.ARCHIVE_NOTE)
  public async archiveNote(id: string) {
    const note = await this.noteService.archiveNote(id);
    await this.actionRecordService.update("note", note);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    this.add("archived", note.id);

    if (this.data.context === "folder") {
      this.remove("notes", note.id);
    } else {
      this.replace("notes", note);
    }
  }

  @Notify(messages.UNARCHIVE_NOTE)
  public async unarchiveNote(id: string) {
    const note = await this.noteService.unarchiveNote(id);
    await this.actionRecordService.update("note", note);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
    }

    this.remove("archived", note.id);
    
    if (this.data.context === "archived") {
      this.remove("notes", note.id);
    } else {
      this.replace("notes", note);
    }
  }

  @Notify(messages.RESTORE_NOTE)
  public async restoreNote(id: string, folderId: string) {
    const note = await this.noteService.restoreNote(id, folderId);
    await this.actionRecordService.restore("note", note);
    this.remove("trash", id);
  }

  @Notify(messages.MOVE_NOTE)
  public async moveNote(id: string, folderId: string) {
    let note = await this.noteService.getNote(id);
    note.folder_id = folderId;
    note = await this.noteService.updateNote(note);
    await this.actionRecordService.update("note", note);

    if (this.data.note.id === note.id) {
      this.setData("note", note);
      const folder = await this.folderService.getFolder(note.folder_id);
      this.setData("folder", folder);
      this.setData("notes", await this.noteService.getNotesByFolderId(note.folder_id));
    }

  }

  @Notify(messages.TRASH_NOTE)
  public async trashNote(id: string) {
    const note = await this.noteService.trashNote(id);
    await this.actionRecordService.trash("note", note);

    if (this.data.note.id === note.id) {
      this.setData("note", reconcile({} as Note));
    }

    this.remove("notes", note.id);
    this.remove("favorites", note.id);
    this.remove("archived", note.id);
    this.remove("recents", note.id);
    this.add("trash", note.id);
  }

  @Notify(messages.DELETE_NOTE)
  public async deleteNote(id: string) {
    await this.noteService.deleteNote(id);
    this.remove("trash", id);
  }
}
