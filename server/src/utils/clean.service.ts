import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import FolderService from '@modules/folder/folder.repository';
import NoteService from '@modules/note/note.repository';

@Injectable()
export class CleanService {
  constructor(
    private folderService: FolderService,
    private noteService: NoteService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanDatabase() {
    await this.folderService.cleanDeleted();
    await this.noteService.cleanDeleted();
  }
}
