import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { NoteService } from "./note.service";
import INoteService from "./note.service.abstract";

@Module({
  providers: [{
    provide: INoteService,
    useClass: NoteService,
  }],
  imports: [DatabaseModule],
  exports: [INoteService]
})
export class NoteModule {}