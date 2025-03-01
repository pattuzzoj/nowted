import { Module } from "@nestjs/common";
import { FolderModule } from "@modules/folder/folder.module";
import { NoteModule } from "@modules/note/note.module";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import ISyncService from "./sync.service.abstract";

@Module({
  controllers: [SyncController],
  providers: [{
    provide: ISyncService,
    useClass: SyncService
  }],
  imports: [FolderModule, NoteModule]
})
export class SyncModule {}