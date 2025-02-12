export interface Folder {
  id: string;
  name: string;
  color: string;
  order: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}