import { Module } from "@nestjs/common";
import { FolderModule } from "@modules/folder/folder.module";
import { NoteModule } from "@modules/note/note.module";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";

@Module({
  controllers: [SyncController],
  providers: [SyncService],
  imports: [FolderModule, NoteModule]
})
export class SyncModule {}