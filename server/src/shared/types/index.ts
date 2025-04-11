import { Request } from 'express';

export interface PayloadJWT {
  sub: string;
}

export interface RefreshTokenPayload extends PayloadJWT {}

export interface AccessTokenPayload extends PayloadJWT {
  email: string;
  username: string;
}

export interface VerificationEmailTokenPayload extends PayloadJWT {}
export interface ResetPasswordTokenPayload extends PayloadJWT {}
export interface ReactivateAccountTokenPayload extends PayloadJWT {}

export interface AuthRequest extends Request {
  user: AccessTokenPayload;
}

export type TokenPurpose =
| 'access-token'
| 'refresh-token'
| 'verification-email'
| 'reset-password'
| 'reactivate-account';
