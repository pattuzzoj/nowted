import { Module } from "@nestjs/common";
import { DatabaseModule } from "@database/database.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule],
  exports: [UserService]
})
export class UserModule {};