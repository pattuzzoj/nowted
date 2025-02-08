import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { NoteModule } from "@modules/note/note.module";
import { FolderService } from "./folder.service";

@Module({
  providers: [FolderService],
  imports: [DatabaseModule, NoteModule],
  exports: [FolderService]
})
export class FolderModule {}