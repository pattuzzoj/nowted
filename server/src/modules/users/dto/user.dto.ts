import { IsEmail, IsLowercase, IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import type { User } from "../interface/user.interface";

export class UserDto implements User {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Length(4, 16)
  username!: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string
}