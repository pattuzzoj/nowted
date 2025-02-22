// @ts-nocheck
import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class TokenDto {
  @IsNotEmpty({
    message: 'Token is required',
  })
  @IsJWT({
    message: 'Invalid token format',
  })
  token: string;
}