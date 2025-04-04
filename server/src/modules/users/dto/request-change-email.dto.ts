// @ts-nocheck
import { IsNotEmpty, IsEmail } from "class-validator";

export default class RequestChangeEmailDto {
  @IsNotEmpty()
  @IsEmail()
  newEmail: string;
}
