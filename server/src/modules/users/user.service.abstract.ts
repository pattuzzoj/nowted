import { User } from "./interfaces/user.interface";

export default abstract class IUserService {
  // CREATE
  abstract createUser(user: User): Promise<User | undefined>;

  // GET
  abstract findUserById(id: string): Promise<User | undefined>;
  abstract findUserByEmail(email: string): Promise<User | undefined>;
  abstract findUserByUsername(username: string): Promise<User | undefined>;
  abstract findUserByLogin(login: string): Promise<User | undefined>;

  // UPDATE
  abstract activateUser(id: string): Promise<void>;
  abstract changeEmail(id: string, email: string): Promise<void>;
  abstract changeUsername(id: string, username: string): Promise<void>;
  abstract changePassword(id: string, password: string): Promise<void>;

  // DELETE
  abstract deleteUser(id: string): Promise<void>;
}