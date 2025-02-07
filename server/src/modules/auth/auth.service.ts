import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "@modules/users/user.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private users: UserService, private mailService: MailService) {}

  async signIn({login, password}: SignInDto) {
    const user = await this.users.findOne(login);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return await this.jwtService.signAsync({sub: user.id, email: user.email});
  }

  async signUp(user: SignUpDto) {
    const alreadyHasEmail = await this.users.findOne(user.email);
    const alreadyHasUsername = await this.users.findOne(user.username);

    if (alreadyHasEmail) {
      throw new ConflictException("Email already used");
    }

    if (alreadyHasUsername) {
      throw new ConflictException("Username already used");
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    await this.users.create(user);
    await this.mailService.sendWelcomeMail(user.email);
  }

  async changePassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.users.changePassword(userId, hashPassword);
  }

  async recoverAccount(account: string) {
    const user = await this.users.findOne(account);

    if (!user) {
      throw new UnauthorizedException("User not exists");
    }

    const token = await this.jwtService.signAsync({sub: user.id});
    await this.mailService.sendRecoverMail(user.email, `<a href="${process.env.SITE_URL}/auth/reset-password?token=${token}">Recover Account</a>`);
  }

  async resetPassword(token: string, password: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.users.changePassword(payload.sub, hashPassword);
  }
}