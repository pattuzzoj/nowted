import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, index, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";
import { jsonb } from "drizzle-orm/pg-core";

export const accountStatusEnum = pgEnum("account_status", ["active", "suspended"]);
export const emailStatusEnum = pgEnum("email_status", ["pending", "verified"]);
export const changeActionEnum = pgEnum('change_action', ['change_email']);
export const changeTypeEnum = pgEnum('change_type', ['insert', 'update', 'delete']);

export const userSchema = pgTable("users", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  email: varchar({length: 100}).unique().notNull(),
  username: varchar({length: 16}).unique().notNull(),
  password: varchar({length: 100}).notNull(),
  account_status: accountStatusEnum().notNull().default("active"),
  email_status: emailStatusEnum().notNull().default("pending"),
  ...timestamps,
}, (table) => [
    index("emailIndex").on(table.email),
    index("usernameIndex").on(table.username)
]);

export const folderSchema = pgTable("folders", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  name: varchar({length: 24}).notNull().default("new folder"),
  color: varchar({length: 10}).notNull().default("#facc15"),
  order: integer().notNull().default(0),
  ...timestamps,
  user_id: uuid().references(() => userSchema.id, { onDelete: "cascade" }).notNull(),
});

export const noteSchema = pgTable("notes", {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey().notNull(),
  name: varchar({length: 48}).notNull().default("note"),
  preview: text().notNull().default(""),
  content: text().notNull().default(""),
  favorite: boolean().notNull().default(false),
  archived: boolean().notNull().default(false),
  ...timestamps,
  user_id: uuid().references(() => userSchema.id).notNull(),
  folder_id: uuid().references(() => folderSchema.id, { onDelete: "cascade" }).notNull(),
});

export const pendingSchema = pgTable('pending_changes', {
  id: uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  old_value: jsonb().notNull(),
  new_value: jsonb().notNull(),
  action: changeActionEnum().notNull(),
  type: changeTypeEnum().notNull(),
  table_name: varchar({ length: 32 }).notNull(),
  record_id: uuid().notNull(),
  user_id: uuid()
    .references(() => userSchema.id, { onDelete: 'cascade' })
    .notNull(),
  metadata: jsonb(),
});
