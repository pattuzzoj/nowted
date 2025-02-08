import { FolderService } from '@modules/folder/folder.service';
import { NoteService } from '@modules/note/note.service';
export declare class CleanService {
    private folderService;
    private noteService;
    constructor(folderService: FolderService, noteService: NoteService);
    cleanDatabase(): Promise<void>;
}
//# sourceMappingURL=clean.service.d.ts.map