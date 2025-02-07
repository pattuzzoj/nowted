export interface Folder {
  id: string;
  name: string;
  color: string;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Note {
  id: string;
  name: string;
  preview: string;
  content: string;
  favorite: boolean;
  archived: boolean;
  folder_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}