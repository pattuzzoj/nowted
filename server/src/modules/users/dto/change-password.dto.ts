// @ts-nocheck
import { IsNotEmpty, MinLength } from "class-validator";

export default class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
