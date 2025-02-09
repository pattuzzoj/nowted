import { Folder } from "entities/folder";
import { Note } from "entities/note";

export interface SyncData {
  notes: Note[],
  folders: Folder[],
  lastSync: string;
}