// @ts-nocheck
import { IsNotEmpty, IsString, Length } from "class-validator";

export default class SignInDto {
  @IsNotEmpty()
  @IsString()
  login: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string
}