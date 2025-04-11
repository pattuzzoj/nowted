import { Injectable, Inject } from '@nestjs/common';
import { and, eq, gt, isNotNull, sql } from 'drizzle-orm';
import type { DatabaseType } from '../../../drizzle.config';
import { folderSchema, noteSchema } from '@database/schema';
import { Note } from './interfaces/note.interface';

@Injectable()
export default class NoteRepository {
  constructor(@Inject('DATABASE') private db: DatabaseType) {}

  async getSinceLastSync(userId: string, lastSync: string) {
    return await this.db
      .select()
      .from(noteSchema)
      .where(
        and(
          eq(noteSchema.user_id, userId),
          gt(noteSchema.updated_at, lastSync),
        ),
      );
  }

  async checkExistsById(id: string) {
    const [note] = await this.db
      .select({ id: noteSchema.id })
      .from(noteSchema)
      .where(and(eq(noteSchema.id, id)));

    return Boolean(note);
  }

  async create(note: Note) {
    await this.db.insert(noteSchema).values(note);
  }

  async update(note: Note) {
    await this.db
      .update(noteSchema)
      .set(note)
      .where(
        and(eq(noteSchema.user_id, note.user_id), eq(noteSchema.id, note.id)),
      );
  }

  async restore(note: Note) {
    const [folderId] = await this.db
      .update(noteSchema)
      .set({ updated_at: note.updated_at, deleted_at: note.deleted_at })
      .where(
        and(
          eq(noteSchema.user_id, note.user_id),
          eq(noteSchema.id, note.id),
          isNotNull(noteSchema.deleted_at),
        ),
      )
      .returning({ folderId: noteSchema.folder_id });

    if (folderId) {
      await this.db
        .update(folderSchema)
        .set({ updated_at: sql`NOW()`, deleted_at: null })
        .where(
          and(
            eq(folderSchema.user_id, note.user_id),
            eq(folderSchema.id, note.id),
          ),
        );
    }
  }

  async delete(note: Note) {
    await this.db
      .update(noteSchema)
      .set({ updated_at: note.updated_at, deleted_at: note.deleted_at })
      .where(
        and(eq(noteSchema.user_id, note.user_id), eq(noteSchema.id, note.id)),
      );
  }

  async deleteData(userId: string) {
    await this.db
    .delete(noteSchema)
    .where(eq(noteSchema.user_id, userId));
  }

  async cleanDeleted() {
    await this.db
      .delete(noteSchema)
      .where(sql`deleted_at + INTERVAL '30 days' <= NOW()`);
  }
}
