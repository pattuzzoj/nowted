export interface Folder {
  id: string;
  name: string;
  color: string;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Note {
  id: string;
  name: string;
  preview: string;
  content: string;
  favorite: boolean;
  archived: boolean;
  folder_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type SyncData = Partial<Folder | Note>;
export type EntityType = "folder" | "note";
export type OperationType = "create" | "update" | "delete" | "restore";

export interface SyncPending {
  id: string;
  type: OperationType;
  entity: EntityType;
  data: SyncData;
  timestamp: number;
}