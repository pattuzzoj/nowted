import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, index, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const accountStatusEnum = pgEnum("account_status", ["pending", "active"]);

export const userSchema = pgTable("users", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  email: varchar({length: 100}).unique().notNull(),
  username: varchar({length: 16}).unique().notNull(),
  password: varchar({length: 100}).notNull(),
  account_status: accountStatusEnum().notNull().default("pending"),
  ...timestamps,
}, (table) => [
    index("emailIndex").on(table.email),
    index("usernameIndex").on(table.username)
]);

export const folderSchema = pgTable("folders", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar({length: 24}).notNull().default("new folder"),
  color: varchar({length: 10}).notNull().default("#facc15"),
  order: integer().notNull().default(0),
  ...timestamps,
  user_id: uuid().references(() => userSchema.id, { onDelete: "cascade" }),
});

export const noteSchema = pgTable("notes", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar({length: 48}).notNull().default("note"),
  preview: text().notNull().default(""),
  content: text().notNull().default(""),
  favorite: boolean().notNull().default(false),
  archived: boolean().notNull().default(false),
  ...timestamps,
  user_id: uuid().references(() => userSchema.id),
  folder_id: uuid().references(() => folderSchema.id, { onDelete: "cascade" }),
});