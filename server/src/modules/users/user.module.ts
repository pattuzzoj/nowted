import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { UserService } from "./user.service";

@Module({
  providers: [UserService],
  imports: [DatabaseModule],
  exports: [UserService]
})
export class UserModule {};