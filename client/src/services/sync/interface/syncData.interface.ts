import { Folder } from "@entities/folder";
import { Note } from "@entities/note";

export interface SyncData {
  id: string;
  type: "create" | "update" | "delete" | "restore";
  entity: "note" | "folder";
  data: Note[] | Folder[];
  timestamp: number;
}