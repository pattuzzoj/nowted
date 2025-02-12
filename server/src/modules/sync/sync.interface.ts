import { Folder } from "@modules/folder/folder.interface";
import { Note } from "@modules/note/note.interface";

export type EntityType = "folder" | "note";
export type OperationType = "create" | "update" | "delete" | "restore";

export interface SyncRecord {
  id: string;
  type: OperationType;
  entity: EntityType;
  data: Partial<Folder | Note>;
  timestamp: number;
}