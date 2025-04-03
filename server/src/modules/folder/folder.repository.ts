import { Injectable, Inject } from '@nestjs/common';
import { and, eq, sql, gt, isNotNull } from 'drizzle-orm';
import type { DatabaseType } from '../../../drizzle.config';
import { folderSchema, noteSchema, userSchema } from '@database/schema';
import { Folder } from './interfaces/folder.interface';

@Injectable()
export default class FolderRepository {
  constructor(@Inject('DATABASE') private db: DatabaseType) {}

  async getFoldersSinceLastSync(userId: string, lastSync: string) {
    return await this.db
      .select()
      .from(folderSchema)
      .where(
        and(
          eq(folderSchema.user_id, userId),
          gt(folderSchema.updated_at, lastSync),
        ),
      );
  }

  async checkIfFolderExists(id: string) {
    const folder = await this.db
      .select({ id: folderSchema.id })
      .from(folderSchema)
      .where(and(eq(folderSchema.id, id)));

    return Boolean(folder);
  }

  async create(folder: Folder) {
    await this.db.insert(folderSchema).values(folder);
  }

  async update(folder: Folder) {
    await this.db
      .update(folderSchema)
      .set(folder)
      .where(
        and(
          eq(folderSchema.user_id, folder.user_id),
          eq(folderSchema.id, folder.id),
        ),
      );
  }

  async restore(folder: Folder) {
    await this.db.batch([
      this.db
        .update(folderSchema)
        .set(folder)
        .where(
          and(
            eq(folderSchema.user_id, folder.user_id),
            eq(folderSchema.id, folder.id),
            isNotNull(folderSchema.deleted_at),
          ),
        ),
      this.db
        .update(noteSchema)
        .set({ updated_at: new Date().toISOString(), deleted_at: null })
        .where(
          and(
            eq(noteSchema.user_id, folder.user_id),
            eq(noteSchema.folder_id, folder.id),
            isNotNull(noteSchema.deleted_at),
          ),
        ),
    ]);
  }

  async delete(folder: Folder) {
    await this.db.batch([
      this.db
        .update(folderSchema)
        .set(folder)
        .where(
          and(
            eq(folderSchema.user_id, folder.user_id),
            eq(folderSchema.id, folder.id),
          ),
        ),
      this.db
        .update(noteSchema)
        .set({
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString(),
        })
        .where(
          and(
            eq(noteSchema.user_id, folder.user_id),
            eq(noteSchema.folder_id, folder.id),
          ),
        ),
    ]);
  }

  async destroyData(userId: string) {
    await this.db
    .delete(folderSchema)
    .where(eq(folderSchema.user_id, userId))
  }

  async cleanDeletedFolders() {
    await this.db
      .delete(folderSchema)
      .where(sql`deleted_at + INTERVAL '30 days' <= NOW()`);
  }
}
