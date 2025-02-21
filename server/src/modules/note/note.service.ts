import { Injectable, Inject } from "@nestjs/common";
import { and, eq, gt, isNotNull, sql } from "drizzle-orm";
import type { DatabaseType } from "../../../drizzle.config";
import { folderSchema, noteSchema } from "@database/schema";
import { Note } from "./note.interface";

@Injectable()
export class NoteService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async getNotes(userId: string, lastSync: Date) {
    return await this.db
    .select({
      id: noteSchema.id,
      name: noteSchema.name,
      preview: noteSchema.preview,
      content: noteSchema.content,
      favorite: noteSchema.favorite,
      archived: noteSchema.archived,
      folder_id: noteSchema.folder_id,
      created_at: noteSchema.created_at,
      updated_at: noteSchema.updated_at,
      deleted_at: noteSchema.deleted_at
    })
    .from(noteSchema)
    .where(
      and(
        eq(noteSchema.user_id, userId),
        gt(noteSchema.updated_at, lastSync)
      )
    );
  }

  async checkIfNoteExist(userId: string, noteId: string) {
    const note = await this.db
    .select({id: noteSchema.id})
    .from(noteSchema)
    .where(
      and(
        eq(noteSchema.user_id, userId),
        eq(noteSchema.id, noteId)
      )
    );

    return note[0];
  }

  async create(userId: string, note: Note) {
    return await this.db
    .insert(noteSchema)
    .values({user_id: userId, ...note});
  }

  async update(userId: string, note: Note) {
    note.created_at = new Date(note.created_at);
    note.updated_at = new Date(note.updated_at);
    note.deleted_at = note.deleted_at ? note.deleted_at : null;

    await this.db
    .update(noteSchema)
    .set(note)
    .where(
      and(
        eq(noteSchema.user_id, userId),
        eq(noteSchema.id, note.id)
      )
    );
  }

  async restore(userId: string, note: Note) {
    const [folderId] = await this.db
    .update(noteSchema)
    .set({updated_at: note.updated_at, deleted_at: note.deleted_at})
    .where(
      and(
        eq(noteSchema.user_id, userId),
        eq(noteSchema.id, note.id),
        isNotNull(noteSchema.deleted_at),
      )
    )
    .returning({folderId: noteSchema.folder_id});

    if(folderId) {
      await this.db
      .update(folderSchema)
      .set({updated_at: sql`NOW()`, deleted_at: null})
      .where(
        and(
          eq(folderSchema.user_id, userId),
          eq(folderSchema.id, note.id),
        )
      );
    }
  }

  async delete(userId: string, note: Note) {
    await this.db
    .update(noteSchema)
    .set({updated_at: note.updated_at, deleted_at: note.deleted_at})
    .where(
      and(
        eq(noteSchema.user_id, userId),
        eq(noteSchema.id, note.id),
      )
    );
  }

  async cleanDeletedNotes() {
    await this.db
    .delete(noteSchema)
    .where(sql`deleted_at + INTERVAL '30 days' <= NOW()`)
  }
}