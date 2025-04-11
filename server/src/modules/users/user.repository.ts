import { Injectable, Inject } from '@nestjs/common';
import { eq, or } from 'drizzle-orm';
import type { DatabaseType } from '../../../drizzle.config';
import { userSchema } from '@database/schema';
import { User } from './interfaces/user.interface';

@Injectable()
export default class UserRepository {
  constructor(@Inject('DATABASE') private db: DatabaseType) {}

  async create(user: User) {
    const [result] = await this.db.insert(userSchema).values(user).returning();

    return result;
  }

  async findByLogin(login: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(or(eq(userSchema.email, login), eq(userSchema.username, login)));

    return user;
  }

  async findById(id: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));
    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email));

    return user;
  }

  async findByUsername(username: string) {
    const [user] = await this.db
      .select()
      .from(userSchema)
      .where(eq(userSchema.username, username));

    return user;
  }

  async activateAccount(id: string) {
    await this.db
      .update(userSchema)
      .set({ account_status: 'active', updated_at: new Date().toISOString() })
      .where(eq(userSchema.id, id));
  }

  async changeEmail(id: string, email: string) {
    await this.db
      .update(userSchema)
      .set({ email, updated_at: new Date().toISOString() })
      .where(eq(userSchema.id, id));
  }

  async changeUsername(id: string, username: string) {
    await this.db
      .update(userSchema)
      .set({ username, updated_at: new Date().toISOString() })
      .where(eq(userSchema.id, id));
  }

  async changePassword(id: string, password: string) {
    await this.db
      .update(userSchema)
      .set({ password, updated_at: new Date().toISOString() })
      .where(eq(userSchema.id, id));
  }

  async suspendAccount(id: string) {
    await this.db
      .update(userSchema)
      .set({
        account_status: 'suspended',
        updated_at: new Date().toISOString(),
      })
      .where(eq(userSchema.id, id));
  }

  async delete(id: string) {
    await this.db.delete(userSchema).where(eq(userSchema.id, id));
  }
}
