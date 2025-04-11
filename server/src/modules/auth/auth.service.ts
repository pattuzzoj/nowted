import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { messages } from '@utils/messages';
import type { Login, Register, Token } from './interfaces';
import UserRepository from '@modules/users/user.repository';
import MailService from '@modules/mail/mail.service';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  ResetPasswordTokenPayload,
  TokenPurpose,
  VerificationEmailTokenPayload,
} from '@shared/types';

@Injectable()
export default class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(credentials: Login) {
    const user = await this.userRepository.findByLogin(credentials.login);

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

    if (user.email_status === 'pending') {
      const token = await this.generateVerificationMailToken({ sub: user.id });
      await this.mailService.sendVerificationMail(user.email, token);
      throw new UnauthorizedException(messages.EMAIL_NOT_VERIFIED);
    }

    if (user.account_status === 'suspended') {
      await this.reactivateAccount(user.id);
    }

    const refreshToken = await this.generateRefreshToken({ sub: user.id });
    const accessToken = await this.generateAccessToken({
      sub: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  async register(registration: Register) {
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.findByEmail(registration.email),
      this.userRepository.findByUsername(registration.username),
    ]);

    if (emailExists) {
      throw new ConflictException(messages.EMAIL_ALREADY_USED);
    }

    if (usernameExists) {
      throw new ConflictException(messages.USERNAME_ALREADY_USED);
    }

    registration.password = await this.hashPassword(registration.password);

    const user = await this.userRepository.create(registration);

    if (!user) {
      throw new InternalServerErrorException();
    }

    const token = await this.generateVerificationMailToken({ sub: user.id });
    await this.mailService.sendVerificationMail(user!.email, token);
  }

  async verifyEmail(token: Token) {
    const payload = await this.verifyToken<VerificationEmailTokenPayload>(
      token,
      'verification-email',
    );
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND);
    }

    if (user.email_status === 'verified') {
      throw new ConflictException(messages.EMAIL_ALREADY_VERIFIED);
    }

    await this.userRepository.activateAccount(user.id);
    await this.mailService.sendWelcomeMail(user.email);
  }

  async resendVerification(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(messages.USER_NOT_FOUND);
    }

    if (user.email_status === 'verified') {
      throw new ConflictException(messages.EMAIL_ALREADY_VERIFIED);
    }

    const token = await this.generateVerificationMailToken({ sub: user.id });
    await this.mailService.sendVerificationMail(user.email, token);
  }

  async recoverAccount(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(messages.USER_NOT_FOUND);
    }

    const token = await this.generateResetPasswordToken({ sub: user.id });
    await this.mailService.sendRecoverMail(user.email, token);
  }

  async resetPassword(token: string, password: string) {
    const payload = await this.verifyToken<ResetPasswordTokenPayload>(
      token,
      'reset-password',
    );

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND);
    }

    const hashPassword = await this.hashPassword(password);
    await this.userRepository.changePassword(payload.sub, hashPassword);
  }

  async suspendUserAccount(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND);
    }

    if (user.account_status === 'suspended') {
      throw new ConflictException(messages.ACCOUNT_ALREADY_SUSPENDED);
    }

    await this.userRepository.suspendAccount(user.id);
    await this.mailService.sendAccountSuspensionMail(user.email);
  }

  async reactivateAccount(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND);
    }

    if (user.account_status !== 'suspended') {
      throw new ConflictException(messages.ACCOUNT_NOT_SUSPENDED);
    }

    await this.userRepository.activateAccount(userId);
    await this.mailService.sendAccountReactivationMail(user.email);
  }

  
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, await bcrypt.genSalt());
  }

  async verifyToken<T>(token: string, purpose: TokenPurpose) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env['JWT_SECRET']!,
    });
    
    if (payload.purpose !== purpose) {
      throw new BadRequestException(`Token is not for ${purpose} purpose`);
    }
    
    if (!payload.sub) {
      throw new BadRequestException('Invalid token: missing subject');
    }
    
    const user = await this.userRepository.findById(payload.sub);
    
    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND);
    }

    return payload as T;
  }
  
  private async generateRefreshToken(payload: RefreshTokenPayload) {
    return await this.jwtService.signAsync(
      {
        ...payload,
        purpose: 'refresh-token',
      },
      {
        expiresIn: '30d',
      },
    );
  }
  
  async generateAccessToken(payload: Omit<AccessTokenPayload, 'purpose'>) {
    return await this.jwtService.signAsync(
      {
        ...payload,
        purpose: 'access-token',
      },
      {
        expiresIn: '15m',
      },
    );
  }
  
  private async generateVerificationMailToken(
    payload: VerificationEmailTokenPayload,
  ) {
    return await this.jwtService.signAsync(
      {
        ...payload,
        purpose: 'verification-email',
      },
      {
        expiresIn: '15m',
      },
    );
  }

  private async generateResetPasswordToken(payload: ResetPasswordTokenPayload) {
    return await this.jwtService.signAsync(
      {
        ...payload,
        purpose: 'reset-password',
      },
      {
        expiresIn: '15m',
      },
    );
  }
}
