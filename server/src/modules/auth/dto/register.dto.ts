// @ts-nocheck
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export default class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}