import { Injectable, NotImplementedException } from '@nestjs/common';
import { messages } from '@utils/messages';
import { SyncRecord } from './sync.interface';
import FolderRepository from '@modules/folder/folder.repository';
import NoteRepository from '@modules/note/note.repository';

@Injectable()
export default class SyncService {
  constructor(
    private folderService: FolderRepository,
    private noteService: NoteRepository,
  ) {}

  async fetch(userId: string, lastSync: string) {
    const folders = await this.folderService.getSinceLastSync(
      userId,
      lastSync,
    );
    const notes = await this.noteService.getSinceLastSync(
      userId,
      lastSync,
    );

    return {
      notes,
      folders,
    };
  }

  async push(userId: string, records: SyncRecord[]) {
    const orderedRecords = records.sort((item, nextItem) => {
      return (
        new Date(item.timestamp).getTime() -
        new Date(nextItem.timestamp).getTime()
      );
    });

    for (const { entity, type, data } of orderedRecords) {
      let entityService;

      if (entity === 'folder') {
        entityService = this.folderService;
      } else if (entity === 'note') {
        entityService = this.noteService;
      } else {
        throw new NotImplementedException(messages.ENTITY_NOT_EXIST);
      }

      data.user_id = userId;

      if (!(type in entityService)) {
        throw new NotImplementedException(messages.TYPE_OPERATION_NOT_EXIST);
      }

      await entityService[type](data);
    }
  }
}
