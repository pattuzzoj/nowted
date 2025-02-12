export interface Note {
  id: string;
  name: string;
  preview: string;
  content: string;
  favorite: boolean;
  archived: boolean;
  folder_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}