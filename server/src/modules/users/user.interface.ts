export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  account_status: "pending" | "active";
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}