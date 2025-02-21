import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "@modules/users/user.service";
import { MailService } from "@modules/mail/mail.service";
import LoginDto from "./dto/login.dto";
import RegisterDto from "./dto/register.dto";
import { messages } from "@utils/messages";
import ResetPasswordDto from "./dto/reset-password.dto";
import TokenDto from "./dto/token.dto";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private users: UserService, private mailService: MailService) {}

  async login({login, password}: LoginDto) {
    const user = await this.users.findOne(login);

    if (!user) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }

    if (user.account_status !== "active") {
      throw new UnauthorizedException(messages.ACCOUNT_NOT_ACTIVE);
    }

    return await this.jwtService.signAsync({sub: user.id, email: user.email});
  }

  async register(registerDto: RegisterDto) {
    const alreadyHasEmail = await this.users.findOne(registerDto.email);
    const alreadyHasUsername = await this.users.findOne(registerDto.username);

    if (alreadyHasEmail) {
      throw new ConflictException(messages.EMAIL_ALREADY_USED);
    }

    if (alreadyHasUsername) {
      throw new ConflictException(messages.USERNAME_ALREADY_USED);
    }

    const salt = await bcrypt.genSalt();
    registerDto.password = await bcrypt.hash(registerDto.password, salt);

    await this.users.createUser(registerDto);
    await this.mailService.sendWelcomeMail(registerDto.email);
  }

  async activateAccount({token}: TokenDto) {
    const payload = await this.jwtService.verifyAsync(token, { secret: process.env["JWT_SECRET"]! });

    await this.users.activateAccount(payload.sub);
  }

  async recoverAccount(account: string) {
    const user = await this.users.findOne(account);

    if (!user) {
      throw new UnauthorizedException(messages.ACCOUNT_NOT_EXIST);
    }

    const token = await this.jwtService.signAsync({sub: user.id});
    await this.mailService.sendRecoverMail(user.email, `<a href="${process.env["SITE_URL"]!}/auth/reset-password?token=${token}">Recover Account</a>`);
  }

  async resetPassword({token, password}: ResetPasswordDto) {
    const payload = await this.jwtService.verifyAsync(token, { secret: process.env["JWT_SECRET"]! });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    

    await this.users.changePassword(payload.sub, hashPassword);
  }
}