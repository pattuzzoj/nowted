import type { DatabaseType } from "@root/drizzle.config";
import { Note } from "./interface/note.interface";
export declare class NoteService {
    private db;
    constructor(db: DatabaseType);
    getNotes(userId: string, lastSync: Date): Promise<{
        id: string;
        name: string;
        preview: string | null;
        content: string | null;
        favorite: boolean;
        archived: boolean;
        folder_id: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }[]>;
    checkIfNoteExist(userId: string, noteId: string): Promise<{
        id: string;
    } | undefined>;
    create(userId: string, note: Note): Promise<{
        id: string;
    }[]>;
    update(userId: string, note: Note): Promise<void>;
    restore(userId: string, note: Note): Promise<void>;
    delete(userId: string, note: Note): Promise<void>;
    cleanDeletedNotes(): Promise<void>;
}
//# sourceMappingURL=note.service.d.ts.map