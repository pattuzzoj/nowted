import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "@modules/users/user.service";
import { MailService } from "@modules/mail/mail.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
import { messages } from "@utils/messages";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private users: UserService, private mailService: MailService) {}

  async signIn({login, password}: SignInDto) {
    const user = await this.users.findOne(login);

    if (!user) {
      throw new UnauthorizedException({
        ...messages.INVALID_CREDENTIALS,
        timestamp: new Date().toISOString()
      });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new UnauthorizedException({
        ...messages.INVALID_CREDENTIALS,
        timestamp: new Date().toISOString()
      });
    }

    return await this.jwtService.signAsync({sub: user.id, email: user.email});
  }

  async signUp(user: SignUpDto) {
    const alreadyHasEmail = await this.users.findOne(user.email);
    const alreadyHasUsername = await this.users.findOne(user.username);

    if (alreadyHasEmail) {
      throw new ConflictException({
        ...messages.EMAIL_ALREADY_USED,
        timestamp: new Date().toISOString()
      });
    }

    if (alreadyHasUsername) {
      throw new ConflictException({
        ...messages.USERNAME_ALREADY_USED,
        timestamp: new Date().toISOString()
      });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    await this.users.createUser(user);
    await this.mailService.sendWelcomeMail(user.email);
  }

  async recoverAccount(account: string) {
    const user = await this.users.findOne(account);

    if (!user) {
      throw new UnauthorizedException({
        ...messages.ACCOUNT_NOT_EXIST,
        timestamp: new Date().toISOString()
      });
    }

    const token = await this.jwtService.signAsync({sub: user.id});
    await this.mailService.sendRecoverMail(user.email, `<a href="${process.env["SITE_URL"]!}/auth/reset-password?token=${token}">Recover Account</a>`);
  }

  async resetPassword(token: string, password: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret: process.env["JWT_SECRET"]! });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.users.changePassword(payload.sub, hashPassword);
  }
}