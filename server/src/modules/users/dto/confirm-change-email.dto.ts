// @ts-nocheck
import { IsNotEmpty, IsNumber, Length, MinLength } from "class-validator";

export default class ConfirmChangeEmailDto {
  @IsNotEmpty()
  @IsNumber()
  @Length(4, 4)
  pin: number;
}
