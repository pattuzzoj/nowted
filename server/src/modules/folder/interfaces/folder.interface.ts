import { folderSchema } from "@database/schema";
import { InferInsertModel } from "drizzle-orm";

export type Folder = InferInsertModel<typeof folderSchema> & {
  id: string;
};