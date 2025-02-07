import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { FolderService } from "./folder.service";
import { NoteModule } from "../note/note.module";

@Module({
  providers: [FolderService],
  imports: [DatabaseModule, NoteModule],
  exports: [FolderService]
})
export class FolderModule {}