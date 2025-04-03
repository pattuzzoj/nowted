import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { messages } from '@utils/messages';
import { Login, Register, Token } from './interfaces';
import UserRepository from '@modules/users/user.repository';
import MailService from '@modules/mail/mail.service';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async login(credentials: Login) {
    const user = await this.userRepository.findUserByLogin(credentials.login);

    if (!user) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }

    const isSamePassword = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isSamePassword) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }

    if (user.account_status !== 'active') {
      const token = await this.jwtService.signAsync(
        {
          sub: user!.id,
          email: user!.email,
        },
        {
          expiresIn: '5m',
        },
      );

      await this.mailService.sendVerificationMail(user!.email, token);
      throw new UnauthorizedException(messages.ACCOUNT_NOT_ACTIVE);
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return token;
  }

  async register(registration: Register) {
    const alreadyHasEmail = await this.userRepository.findUserByEmail(
      registration.email,
    );
    const alreadyHasUsername = await this.userRepository.findUserByUsername(
      registration.username,
    );

    if (alreadyHasEmail) {
      throw new ConflictException(messages.EMAIL_ALREADY_USED);
    }

    if (alreadyHasUsername) {
      throw new ConflictException(messages.USERNAME_ALREADY_USED);
    }

    const salt = await bcrypt.genSalt();
    registration.password = await bcrypt.hash(registration.password, salt);

    const user = await this.userRepository.createUser(registration);
    const token = await this.jwtService.signAsync(
      {
        sub: user!.id,
        email: user!.email,
      },
      {
        expiresIn: '5m',
      },
    );

    await this.mailService.sendVerificationMail(user!.email, token);
  }

  async activateAccount(token: Token) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env['JWT_SECRET']!,
    });

    await this.userRepository.activateUser(payload.sub);
    await this.mailService.sendWelcomeMail(payload.email);
  }

  async recoverAccount(email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException(messages.ACCOUNT_NOT_EXIST);
    }

    const token = await this.jwtService.signAsync({ sub: user.id });
    await this.mailService.sendRecoverMail(user.email, token);
  }

  async resetPassword(token: string, password: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env['JWT_SECRET']!,
    });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.userRepository.changePassword(payload.sub, hashPassword);
  }

  async deleteAccount() {}
}
