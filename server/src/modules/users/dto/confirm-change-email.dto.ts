// @ts-nocheck
import { IsNotEmpty, IsNumber, Length, MinLength } from "class-validator";

export default class ConfirmChangeEmailDto {
  @IsNotEmpty()
  @IsNumber()
  pin: number;
}
