import { Injectable, Inject } from "@nestjs/common";
import { and, eq, sql , gt, isNotNull} from "drizzle-orm";
import type { DatabaseType } from "../../../drizzle.config";
import { folderSchema, noteSchema } from "@database/schema";
import { Folder } from "./folder.interface";

@Injectable()
export class FolderService {
  constructor(@Inject("DATABASE") private db: DatabaseType) {}

  async getFolders(userId: string, lastSync: Date) {
    return await this.db
    .select({
      id: folderSchema.id,
      name: folderSchema.name,
      color: folderSchema.color,
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
    );
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
    .values({user_id: userId, ...folder, updated_at: new Date()});
  }

  async update(userId: string, folder: Folder) {
    await this.db
    .update(folderSchema)
    .set({
      name: sql`COALESCE(${folder.name}, ${folderSchema.name})`,
      color: sql`COALESCE(${folder.color}, ${folderSchema.color})`,
      order: sql`COALESCE(${folder.order}, ${folderSchema.order})`,
      updated_at: new Date()
    })
    .where(
      and(
        eq(folderSchema.user_id, userId),
        eq(folderSchema.id, folder.id)
      )
    );
  }

  async restore(userId: string, folderId: string) {
    await this.db.batch([
      this.db
      .update(folderSchema)
      .set({updated_at: new Date(), deleted_at: null})
      .where(
        and(
          eq(folderSchema.user_id, userId),
          eq(folderSchema.id, folderId),
          isNotNull(folderSchema.deleted_at)
        )
      ),
      this.db
      .update(noteSchema)
      .set({updated_at: new Date(), deleted_at: null })
      .where(
        and(
          eq(noteSchema.user_id, userId),
          eq(noteSchema.folder_id, folderId),
          isNotNull(noteSchema.deleted_at)
        )
      )
    ]);
  }

  async delete(userId: string, folderId: string) {
    await this.db.batch([
      this.db
      .update(folderSchema)
      .set({updated_at: new Date(), deleted_at: new Date()})
      .where(
        and(
          eq(folderSchema.user_id, userId),
          eq(folderSchema.id, folderId)
        )
      ),
      this.db
      .update(noteSchema)
      .set({updated_at: new Date(), deleted_at: new Date() })
      .where(
        and(
          eq(noteSchema.user_id, userId),
          eq(noteSchema.folder_id, folderId)
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