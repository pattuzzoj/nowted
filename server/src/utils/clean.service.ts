import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FolderService } from '../modules/folder/folder.service';
import { NoteService } from '../modules/note/note.service';

@Injectable()
export class CleanService {
  constructor(private folderService: FolderService, private noteService: NoteService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanDatabase() {
    try {
      await this.folderService.cleanDeletedFolders();
    } catch (error) {}

    try {
      await this.noteService.cleanDeletedNotes();
    } catch (error) {}
  }
}
