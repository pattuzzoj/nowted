// @ts-nocheck
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export default class LoginDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}