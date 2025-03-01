import { Note } from "./interfaces/note.interface";

export default abstract class INoteService {
  abstract getNotesSinceLastSync(userId: string, lastSync: string): Promise<Note[]>

  abstract checkIfNoteExists(id: string): Promise<boolean>
  abstract create(note: Note): Promise<void>
  abstract update(note: Note): Promise<void>
  abstract restore(folder: Note): Promise<void>
  abstract delete(folder: Note): Promise<void>
}