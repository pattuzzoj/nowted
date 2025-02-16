export class Folder {
  id: string;
  name: string;
  color: string;
  order: number = 0;
  created_at: string;
  updated_at: string;
  deleted_at: string | null = null;

  constructor(name: string, color: string, order: number = 0) {
    const date = new Date().toISOString();

    this.id = crypto.randomUUID();
    this.name = name;
    this.color = color;
    this.order = order;
    this.created_at = date;
    this.updated_at = date;
  }
}