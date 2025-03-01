import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { NoteModule } from "@modules/note/note.module";
import { FolderService } from "./folder.service";
import IFolderService from "./folder.service.abstract";

@Module({
  providers: [{
    provide: IFolderService,
    useClass: FolderService
  }],
  imports: [DatabaseModule, NoteModule],
  exports: [IFolderService]
})
export class FolderModule {}