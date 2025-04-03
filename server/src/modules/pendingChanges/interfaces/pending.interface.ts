
import { pendingSchema } from "@database/schema";
import { InferInsertModel } from "drizzle-orm";

export type PendingChanges = InferInsertModel<typeof pendingSchema> & {
  id: string;
};
