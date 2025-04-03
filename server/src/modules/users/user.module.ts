import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import PendingModule from '@modules/pendingChanges/pending.module';
import MailModule from '@modules/mail/mail.module';
import UserController from './user.controller';
import UserRepository from './user.repository';
import UserService from './user.service';
import FolderModule from '@modules/folder/folder.module';
import NoteModule from '@modules/note/note.module';

@Module({
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService
  ],
  imports: [DatabaseModule, FolderModule, NoteModule, PendingModule, MailModule],
  exports: [UserRepository, UserService],
})
export default class UserModule {}
