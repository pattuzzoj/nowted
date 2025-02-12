import { Injectable, NotImplementedException } from "@nestjs/common";
import { FolderService } from "@modules/folder/folder.service";
import { NoteService } from "@modules/note/note.service";
import { messages } from "@utils/messages";
import { SyncRecord } from "./sync.interface";

@Injectable()
export class SyncService {
  constructor(private folderService: FolderService, private noteService: NoteService) {}

  async getData(userId: string, lastSync: Date) {
    const folders = await this.folderService.getFolders(userId, lastSync);
    const notes = await this.noteService.getNotes(userId, lastSync);

    return {
      notes,
      folders
    }
  }

  async syncData(userId: string, syncPending: SyncRecord[]) {
    const syncList = syncPending.sort((item, nextItem) => item.timestamp - nextItem.timestamp);

    for (const {entity, type, data} of syncList) {
      let entityService;
  
      if (entity === "folder") {
        entityService = this.folderService;
      } else if (entity === "note") {
        entityService = this.noteService;
      } else {
        throw new NotImplementedException({
          ...messages.ENTITY_NOT_EXIST,
          timestamp: new Date().toISOString()
        });
      }
  
      switch (type) {
        case "create":
          await entityService.create(userId, data);
          break;
        case "update":
          await entityService.update(userId, data);
          break;
        case "delete":
          await entityService.delete(userId, data.id);
          break;
        case "restore":
          await entityService.restore(userId, data.id);
          break;
        default:
          throw new NotImplementedException({
            ...messages.TYPE_OPERATION_NOT_EXIST,
            timestamp: new Date().toISOString()
          });
      }
    }
  }
}