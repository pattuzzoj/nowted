import { userSchema } from "@database/schema";
import { InferInsertModel } from "drizzle-orm";

export type User = InferInsertModel<typeof userSchema>;
