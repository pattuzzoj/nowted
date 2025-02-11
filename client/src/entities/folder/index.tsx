import { Folder as IFolder } from "@/types";

export class Folder implements IFolder {
  id: string;
  name: string;
  color: string;
  order: number = 0;
  created_at: string;
  updated_at: string;
  deleted_at: string | null = null;

  constructor({name, color, order}: {name: string, color: string, order: number}) {
    const date = (new Date()).toISOString();

    this.id = crypto.randomUUID();
    this.name = name;
    this.color = color;
    this.order = order;
    this.created_at = date;
    this.updated_at = date;
  }
}