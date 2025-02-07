import { Injectable, Inject } from "@nestjs/common";
import { DatabaseType } from "drizzle.config";
import { and, eq, sql , gt, isNotNull} from "drizzle-orm";
import { folderSchema, noteSchema } from "../../database/schema";
import { Folder } from "./folder.interface";

@Injectable()
export class FolderService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async getFolders(userId: string, lastSync: Date) {
    return await this.db
    .select({
      id: folderSchema.id,
      name: folderSchema.name,
      order: folderSchema.order,
      created_at: folderSchema.created_at,
      updated_at: folderSchema.updated_at,
      deleted_at: folderSchema.deleted_at
    })
    .from(folderSchema)
    .where(
      and(
        eq(folderSchema.user_id, userId),
        gt(folderSchema.updated_at, lastSync)
      )
    ).orderBy(folderSchema.order);
  }

  async checkIfFolderExist(userId: string, folderId: string) {
    const folder = await this.db
    .select({id: folderSchema.id})
    .from(folderSchema)
    .where(
      and(
        eq(folderSchema.user_id, userId),
        eq(folderSchema.id, folderId)
      )
    );

    return folder[0];
  }

  async create(userId: string, folder: Folder) {
    return await this.db
    .insert(folderSchema)
    .values({user_id: userId, ...folder, updated_at: sql`NOW()`})
    .returning({id: folderSchema.id});
  }

  async update(userId: string, folder: Folder) {
    await this.db
    .update(folderSchema)
    .set({...folder, updated_at: sql`NOW()`})
    .where(
      and(
        eq(folderSchema.user_id, userId),
        eq(folderSchema.id, folder.id)
      )
    );
  }

  async restore(userId: string, folder: Folder) {
    await this.db.batch([
      this.db
      .update(folderSchema)
      .set({updated_at: sql`NOW()`, deleted_at: null})
      .where(
        and(
          isNotNull(folderSchema.deleted_at),
          eq(folderSchema.user_id, userId),
          eq(folderSchema.id, folder.id)
        )
      ),
      this.db
      .update(noteSchema)
      .set({updated_at: sql`NOW()`, deleted_at: null })
      .where(
        and(
          eq(noteSchema.user_id, userId),
          eq(noteSchema.folder_id, folder.id),
          isNotNull(noteSchema.deleted_at),
        )
      )
    ]);
  }

  async delete(userId: string, folder: Folder) {
    await this.db.batch([
      this.db
      .update(folderSchema)
      .set({updated_at: sql`NOW()`, deleted_at: sql`NOW()`})
      .where(
        and(
          eq(folderSchema.user_id, userId),
          eq(folderSchema.id, folder.id)
        )
      ),
      this.db
      .update(noteSchema)
      .set({updated_at: sql`NOW()`, deleted_at: sql`NOW()` })
      .where(
        and(
          eq(noteSchema.user_id, userId),
          eq(noteSchema.folder_id, folder.id)
        )
      )
    ]);
  }

  async cleanDeletedFolders() {
    await this.db
    .delete(folderSchema)
    .where(sql`deleted_at + INTERVAL '30 days' <= NOW()`)
  }
}