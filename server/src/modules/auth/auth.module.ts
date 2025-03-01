import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "@database/database.module";
import { UserModule } from "@modules/users/user.module";
import MailModule from "@modules/mail/mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { IAuthService } from "./auth.service.abstract";

@Module({
  controllers: [AuthController],
  providers: [{
    provide: IAuthService,
    useClass: AuthService,
  }],
  imports: [
    DatabaseModule,
    UserModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env["JWT_SECRET"]!,
      signOptions: { expiresIn: '30d' },
    })
  ],
})
export class AuthModule {}