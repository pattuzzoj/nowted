import type { Login } from "./interfaces/login.interface";
import type { Register } from "./interfaces/register.interface";
import type { Token } from "./interfaces/token.type";

export abstract class IAuthService {
  abstract login(credentials: Login): Promise<Token>;
  abstract register(registration: Register): Promise<void>;
  abstract activateAccount(token: Token): Promise<void>;
  abstract recoverAccount(email: string): Promise<void>;
  abstract resetPassword(token: string, password: string): Promise<void>;
  abstract deleteAccount(id: string): Promise<void>;
}