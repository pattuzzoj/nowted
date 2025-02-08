import type { DatabaseType } from "@root/drizzle.config";
import { Folder } from "./interface/folder.interface";
export declare class FolderService {
    private db;
    constructor(db: DatabaseType);
    getFolders(userId: string, lastSync: Date): Promise<{
        id: string;
        name: string;
        order: number;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
    }[]>;
    checkIfFolderExist(userId: string, folderId: string): Promise<{
        id: string;
    } | undefined>;
    create(userId: string, folder: Folder): Promise<{
        id: string;
    }[]>;
    update(userId: string, folder: Folder): Promise<void>;
    restore(userId: string, folder: Folder): Promise<void>;
    delete(userId: string, folder: Folder): Promise<void>;
    cleanDeletedFolders(): Promise<void>;
}
//# sourceMappingURL=folder.service.d.ts.map