import { Injectable, Inject } from "@nestjs/common";
import { eq, or } from "drizzle-orm";
import { DatabaseType } from "drizzle.config";
import { userSchema } from "@database/schema";
import { User } from "./user.interface";

@Injectable()
export class UserService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async create(user: User) {
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

  async changePassword(id: string, password: string) {
    await this.db
    .update(userSchema)
    .set({password})
    .where(eq(userSchema.id, id));
  }
}