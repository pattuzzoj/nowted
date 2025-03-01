import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { UserService } from "./user.service";
import IUserService from "./user.service.abstract";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
  providers: [{
    provide: IUserService,
    useClass: UserService,
  }],
  imports: [DatabaseModule],
  exports: [IUserService]
})
export class UserModule {};