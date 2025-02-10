import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "@modules/users/user.service";
import { MailService } from "@modules/mail/mail.service";
import SignInDto from "../auth/dto/signIn.dto";
import SignUpDto from "../auth/dto/signUp.dto";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private users: UserService, private mailService: MailService) {}

  async signIn({login, password}: SignInDto) {
    const user = await this.users.findOne(login);

    if (!user) {
      throw new UnauthorizedException({
        status: "error",
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
        timestamp: new Date().toISOString()
      });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new UnauthorizedException({
        status: "error",
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
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
        status: "error",
        statusCode: HttpStatus.CONFLICT,
        message: "Email already used",
        timestamp: new Date().toISOString()
      });
    }

    if (alreadyHasUsername) {
      throw new ConflictException({
        status: "error",
        statusCode: HttpStatus.CONFLICT,
        message: "Username already used",
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
        status: "error",
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Account not exists",
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