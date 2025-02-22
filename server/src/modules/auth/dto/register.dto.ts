// @ts-nocheck
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export default class RegisterDto {
  @IsNotEmpty({
    message: "Email is required"
  })
  @IsEmail({
    message: "Invalid email format"
  })
  email: string;

  @IsNotEmpty({
    message: "Username is required"
  })
  @Length(8, 16, {
    message: "Username must be between 8 and 16 characters long"
  })
  username: string;

  @IsNotEmpty({
    message: "Password is required"
  })
  @MinLength(8, {
    message: "Password must be at least 8 characters long"
  })
  password: string;
}