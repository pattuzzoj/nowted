import { Request } from 'express';

export interface PayloadJWT {
  sub: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user: PayloadJWT;
}