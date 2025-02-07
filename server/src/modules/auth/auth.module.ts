import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../../database/database.module";
import { UserModule } from "../users/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import MailModule from "../mail/mail.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    DatabaseModule,
    UserModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    })
  ],
})
export class AuthModule {}