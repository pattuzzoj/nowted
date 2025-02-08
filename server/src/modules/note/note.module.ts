import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { NoteService } from "./note.service";

@Module({
  providers: [NoteService],
  imports: [DatabaseModule],
  exports: [NoteService]
})
export class NoteModule {}