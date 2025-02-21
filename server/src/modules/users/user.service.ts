import { Injectable, Inject } from "@nestjs/common";
import { eq, or } from "drizzle-orm";
import type { DatabaseType } from "../../../drizzle.config";
import { userSchema } from "@database/schema";
import UserDto from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async createUser(user: UserDto) {
    await this.db
    .insert(userSchema)
    .values(user);
  }

  async findOne(login: string) {
    const [user] = await this.db
    .select({
      id: userSchema.id,
      email: userSchema.email,
      username: userSchema.username,
      password: userSchema.password,
      account_status: userSchema.account_status
    })
    .from(userSchema)
    .where(or(
      eq(userSchema.email, login),
      eq(userSchema.username, login),
    ));

    return user;
  }

  async activateAccount(id: string) {
    await this.db
    .update(userSchema)
    .set({account_status: "active"})
    .where(eq(userSchema.id, id));
  }

  async changeEmail(id: string, email: string) {
    await this.db
    .update(userSchema)
    .set({email})
    .where(eq(userSchema.id, id));
  }

  async changeUsername(id: string, username: string) {
    await this.db
    .update(userSchema)
    .set({username})
    .where(eq(userSchema.id, id));
  }

  async changePassword(id: string, password: string) {
    await this.db
    .update(userSchema)
    .set({password})
    .where(eq(userSchema.id, id));
  }
}