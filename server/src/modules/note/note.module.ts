import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import NoteRepository from './note.repository';

@Module({
  providers: [NoteRepository],
  imports: [DatabaseModule],
  exports: [NoteRepository],
})
export default class NoteModule {}
