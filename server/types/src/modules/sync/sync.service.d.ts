import { FolderService } from "@modules/folder/folder.service";
import { NoteService } from "@modules/note/note.service";
export declare class SyncService {
    private folderService;
    private noteService;
    constructor(folderService: FolderService, noteService: NoteService);
    getData(userId: string, lastSync: Date): Promise<{
        notes: {
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
        }[];
        folders: {
            id: string;
            name: string;
            order: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
        }[];
        lastSync: string;
    }>;
    syncData(userId: string, syncData: any): Promise<{
        lastSync: string;
    }>;
}
//# sourceMappingURL=sync.service.d.ts.map