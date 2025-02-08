import type { AuthRequest } from "@modules/auth/interface/authRequest.interface";
import { SyncService } from "./sync.service";
export declare class SyncController {
    private syncService;
    constructor(syncService: SyncService);
    syncGetData(req: AuthRequest, lastSync: string): Promise<{
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
    syncPostData(req: AuthRequest, data: any): Promise<{
        lastSync: string;
    }>;
}
//# sourceMappingURL=sync.controller.d.ts.map