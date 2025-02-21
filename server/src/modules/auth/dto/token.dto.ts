// @ts-nocheck
import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class TokenDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;
}