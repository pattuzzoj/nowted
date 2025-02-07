import { Module } from "@nestjs/common";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import { FolderModule } from "../folder/folder.module";
import { NoteModule } from "../note/note.module";

@Module({
  controllers: [SyncController],
  providers: [SyncService],
  imports: [FolderModule, NoteModule]
})
export class SyncModule {}