import { Folder } from "@modules/folder/interfaces/folder.interface";
import { Note } from "@modules/note/interfaces/note.interface";

export type EntityType = "folder" | "note";
export type OperationType = "create" | "update" | "delete" | "restore";

export interface SyncRecord {
  id: string;
  type: OperationType;
  entity: EntityType;
  data: Folder & Note;
  timestamp: string;
}