export class Note {
  id: string;
  name: string;
  preview: string = "";
  content: string = "";
  favorite: boolean = false;
  archived: boolean = false;
  folder_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null = null;

  constructor(name: string, folderId: string) {
    const date = new Date().toISOString();

    this.id = crypto.randomUUID();
    this.name = name;
    this.folder_id = folderId;
    this.created_at = date;
    this.updated_at = date;
  }
}