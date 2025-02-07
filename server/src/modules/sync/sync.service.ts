import { Injectable, NotImplementedException } from "@nestjs/common";
import { FolderService } from "../folder/folder.service";
import { NoteService } from "../note/note.service";
import { SyncDto } from "./dto/sync.dto";

@Injectable()
export class SyncService {
  constructor(private folderService: FolderService, private noteService: NoteService) {}

  async getData(userId: string, lastSync: Date) {
    const folders = await this.folderService.getFolders(userId, lastSync);
    const notes = await this.noteService.getNotes(userId, lastSync);

    return {
      notes,
      folders,
      lastSync: (new Date()).toISOString()
    }
  }

  async syncData(userId, syncData) {
    const {folders, notes} = syncData;

    folders.forEach((folder) => {
      const existFolder = this.folderService.checkIfFolderExist(userId, folder.id);

      if (existFolder) {
        this.folderService.create(userId, folder);
      } else {
        this.folderService.update(userId, folder);
      }
    });

    notes.forEach((note) => {
      const existFolder = this.noteService.checkIfNoteExist(userId, note.id);

      if (existFolder) {
        this.noteService.create(userId, note);
      } else {
        this.noteService.update(userId, note);
      }
    });

    // for (const {entity, type, data} of syncData) {
    //   let entityService;
  
    //   if (entity === "folder") {
    //     entityService = this.folderService;
    //   } else if (entity === "note") {
    //     entityService = this.noteService;
    //   } else {
    //     throw new NotImplementedException("entity not exist");
    //   }
  
    //   switch (type) {
    //     case "create":
    //       entityService.create(userId, data);
    //       break;
    //     case "update":
    //       entityService.update(userId, data);
    //       break;
    //     case "delete":
    //       entityService.delete(userId, data);
    //       break;
    //     case "restore":
    //       entityService.restore(userId, data);
    //       break;
    //     default:
    //       throw new NotImplementedException("task not exist");
    //   }
    // }

    return {
      lastSync: (new Date()).toISOString()
    }
  }
}