import { noteSchema } from "@database/schema";
import { InferInsertModel } from "drizzle-orm";

export type Note = InferInsertModel<typeof noteSchema> & {
  id: string;
};