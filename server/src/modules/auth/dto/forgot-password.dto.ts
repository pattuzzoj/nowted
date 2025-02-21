// @ts-nocheck
import { IsNotEmpty, IsEmail } from "class-validator";

export default class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  account: string;
}