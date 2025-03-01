import { Injectable, NotImplementedException } from "@nestjs/common";
import { messages } from "@utils/messages";
import { SyncRecord } from "./sync.interface";
import ISyncService from "./sync.service.abstract";
import INoteService from "@modules/note/note.service.abstract";
import IFolderService from "@modules/folder/folder.service.abstract";

@Injectable()
export class SyncService implements ISyncService {
  constructor(private folderService: IFolderService, private noteService: INoteService) {}

  async fetch(userId: string, lastSync: string) {
    const folders = await this.folderService.getFoldersSinceLastSync(userId, lastSync);
    const notes = await this.noteService.getNotesSinceLastSync(userId, lastSync);

    return {
      notes,
      folders
    }
  }

  async push(userId: string, records: SyncRecord[]) {
    const orderedRecords = records.sort((item, nextItem) => {
      return new Date(item.timestamp).getTime() - new Date(nextItem.timestamp).getTime();
    });

    for (const {entity, type, data} of orderedRecords) {
      let entityService;

      if (entity === "folder") {
        entityService = this.folderService;
      } else if (entity === "note") {
        entityService = this.noteService;
      } else {
        throw new NotImplementedException(messages.ENTITY_NOT_EXIST);
      }

      data.user_id = userId;

      switch (type) {
        case "create":
          await entityService.create(data);
          break;
        case "update":
          await entityService.update(data);
          break;
        case "delete":
          await entityService.delete(data);
          break;
        case "restore":
          await entityService.restore(data);
          break;
        default:
          throw new NotImplementedException(messages.TYPE_OPERATION_NOT_EXIST);
      }
    }
  }
}