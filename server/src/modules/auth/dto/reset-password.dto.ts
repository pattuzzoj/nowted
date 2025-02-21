// @ts-nocheck
import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';
import TokenDto from './token.dto';

export default class ResetPasswordDto extends TokenDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}