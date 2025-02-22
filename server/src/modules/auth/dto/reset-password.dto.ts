// @ts-nocheck
import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';
import TokenDto from './token.dto';

export default class ResetPasswordDto extends TokenDto {
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;
}