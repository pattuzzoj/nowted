import { Injectable, Inject } from '@nestjs/common';
import type { DatabaseType } from '../../../drizzle.config';
import { pendingSchema } from '@database/schema';
import { PendingChanges } from './interfaces/pending.interface';
import { eq, and } from 'drizzle-orm';

@Injectable()
export default class PendingRepository {
  constructor(@Inject('DATABASE') private db: DatabaseType) {}

  async getPendingByAction(userId: string, action: 'change_email') {
    const [result] = await this.db
      .select()
      .from(pendingSchema)
      .where(
        and(
          eq(pendingSchema.user_id, userId),
          eq(pendingSchema.action, action),
        ),
      );

    return result;
  }

  async create(pending: PendingChanges) {
    await this.db.insert(pendingSchema).values(pending);
  }

  async delete(id: string) {
    await this.db.delete(pendingSchema).where(eq(pendingSchema.id, id));
  }
}
