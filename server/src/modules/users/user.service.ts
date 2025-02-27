import { Injectable, Inject } from "@nestjs/common";
import { eq, or } from "drizzle-orm";
import type { DatabaseType } from "../../../drizzle.config";
import { userSchema } from "@database/schema";
import { User } from "./user.interface";

@Injectable()
export class UserService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async createUser(user: User) {
    const [result] = await this.db
    .insert(userSchema)
    .values(user)
    .returning();

    return result;
  }

  async findOne(login: string) {
    const [user] = await this.db
    .select()
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
    .set({account_status: "active", updated_at: new Date()})
    .where(eq(userSchema.id, id));
  }

  async changeEmail(id: string, email: string) {
    await this.db
    .update(userSchema)
    .set({email, updated_at: new Date()})
    .where(eq(userSchema.id, id));
  }

  async changeUsername(id: string, username: string) {
    await this.db
    .update(userSchema)
    .set({username, updated_at: new Date()})
    .where(eq(userSchema.id, id));
  }

  async changePassword(id: string, password: string) {
    await this.db
    .update(userSchema)
    .set({password, updated_at: new Date()})
    .where(eq(userSchema.id, id));
  }

  async deleteUser(id: string) {
    await this.db
    .update(userSchema)
    .set({account_status: "suspended", updated_at: new Date()})
    .where(eq(userSchema.id, id));
  }
}