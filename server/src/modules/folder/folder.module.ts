import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import NoteModule from '@modules/note/note.module';
import FolderRepository from './folder.repository';

@Module({
  providers: [FolderRepository],
  imports: [DatabaseModule, NoteModule],
  exports: [FolderRepository],
})
export default class FolderModule {}
