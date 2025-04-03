import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import UserRepository from './user.repository';
import MailService from '@modules/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { messages } from '@utils/messages';
import PendingRepository from '@modules/pendingChanges/pending.repository';
import { PendingChanges } from '@modules/pendingChanges/interfaces/pending.interface';
import { User } from './interfaces/user.interface';
import { random } from '@utilify/core';
import FolderRepository from '@modules/folder/folder.repository';
import NoteRepository from '@modules/note/note.repository';

@Injectable()
export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private folderRepository: FolderRepository,
    private noteRepository: NoteRepository,
    private pendingRepository: PendingRepository,
    private mailService: MailService,
  ) {}

  async getProfile(userId: string) {
    const { email, username } = await this.userRepository.findUserById(userId) as User;
    return { email, username };
  }

  async checkUsername(username: string) {
    const user = await this.userRepository.findUserByUsername(username);
    return Boolean(user);
  }

  async checkEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    return Boolean(user);
  }

  async requestChangeEmail(userId: string, email: string) {
    const emailExists = await this.checkEmail(email);

    if (emailExists) {
      throw new ConflictException(messages.EMAIL_ALREADY_USED);
    }
    const user = await this.userRepository.findUserById(userId) as User;
    const PIN = random(1000, 9999);

    this.pendingRepository.create({
      user_id: user.id,
      table_name: 'users',
      record_id: user.id,
      action: 'change_email',
      type: 'update',
      old_value: JSON.stringify({
        email: user.email,
      }),
      new_value: JSON.stringify({
        email: email,
      }),
      metadata: JSON.stringify({
        pin: PIN,
      }),
    } as any);

    await this.mailService.sendEmailChangeVerificationPin(email, PIN);
  }

  async handleChangeEmail(userId: string, pin: number) {
    const pendingChange = (await this.pendingRepository.getPendingByAction(
      userId,
      'change_email',
    )) as PendingChanges;
    const metadata = pendingChange.metadata as { pin: number };

    if (metadata.pin !== pin) {
      throw new ConflictException('PIN Inválido');
    }

    const value = pendingChange.new_value as { email: string };

    await this.userRepository.changeEmail(userId, value.email);
    await this.pendingRepository.delete(pendingChange?.id);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findUserById(userId);

    const isSamePassword = await bcrypt.compare(
      currentPassword,
      user!.password,
    );

    if (!isSamePassword) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(newPassword, salt);
    await this.userRepository.changePassword(userId, password);
  }

  async changeUsername(userId: string, username: string) {
    const usernameExists = await this.checkUsername(username);

    if (usernameExists) {
      throw new ConflictException(messages.USERNAME_ALREADY_USED);
    }

    await this.userRepository.changeUsername(userId, username);
  }

  async deleteAllData(userId: string) {
    await this.folderRepository.destroyData(userId);
    await this.noteRepository.destroyData(userId);
  }

  async deleteAccount(userId: string) {
    await this.userRepository.deleteUser(userId);
  }
}
