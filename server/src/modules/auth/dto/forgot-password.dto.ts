// @ts-nocheck
import { IsNotEmpty, IsEmail } from "class-validator";

export default class ForgotPasswordDto {
  @IsNotEmpty({
    message: "Email is required",
  })
  @IsEmail({
    message: "Invalid email format",
  })
  account: string;
}