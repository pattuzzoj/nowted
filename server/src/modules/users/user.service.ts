import { Injectable, Inject } from "@nestjs/common";
import { eq, or } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import type { DatabaseType } from "../../../drizzle.config";
import { userSchema } from "@database/schema";
import { User } from "./interface/user.interface";

@Injectable()
export class UserService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async createUser(user: User) {
    return await this.db
    .insert(userSchema)
    .values(user);
  }

  async findOne(login: string) {
    const [user] = await this.db
    .select({
      id: userSchema.id,
      email: userSchema.email,
      username: userSchema.username,
      password: userSchema.password
    })
    .from(userSchema)
    .where(or(
      eq(userSchema.email, login),
      eq(userSchema.username, login),
    ));

    return user;
  }

  async changeUsername(userId: string, username: string) {
    await this.db
    .update(userSchema)
    .set({username})
    .where(eq(userSchema.id, userId));
  }

  async changeEmail(userId: string, email: string) {
    await this.db
    .update(userSchema)
    .set({email})
    .where(eq(userSchema.id, userId));
  }

  async changePassword(userId: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.db
    .update(userSchema)
    .set({password: hashPassword})
    .where(eq(userSchema.id, userId));
  }
}