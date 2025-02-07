import { Module } from "@nestjs/common";
import { NoteService } from "./note.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
  providers: [NoteService],
  imports: [DatabaseModule],
  exports: [NoteService]
})
export class NoteModule {}