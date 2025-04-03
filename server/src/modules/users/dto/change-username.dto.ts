// @ts-nocheck
import { IsNotEmpty, Length } from "class-validator";

export default class ChangeUsernameDto {
  @IsNotEmpty()
  @Length(8, 16)
  username: string;
}
