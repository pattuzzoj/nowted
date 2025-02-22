// @ts-nocheck
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export default class LoginDto {
  @IsNotEmpty({
    message: "Login is required"
  })
  @IsString({
    message: "Login must be a string"
  })
  login: string;

  @IsNotEmpty({
    message: "Password is required"
  })
  @MinLength(8, {
    message: "Password must be at least 8 characters long"
  })
  password: string;
}