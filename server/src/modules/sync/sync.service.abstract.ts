import { Note } from "@modules/note/interfaces/note.interface";
import { Folder } from "@modules/folder/interfaces/folder.interface";
import { SyncRecord } from "./sync.interface";

export default abstract class ISyncService {
  abstract fetch(userId: string, lastSync: string): Promise<{notes: Note[], folders: Folder[]}>;
  abstract push(userId: string, data: SyncRecord[]): Promise<void>
}