import { adjustDate } from "@utilify/core";
import { StoreOperations } from "@/shared/context/indexedDB";
import { Folder } from "../entities/folder";

export interface IFolderService {
  populate(folders: Folder[]): Promise<void>;
  get(id: string): Promise<Folder>;
  getAll(): Promise<Folder[]>;
  create(folder: Folder): Promise<Folder>;
  update(folder: Folder): Promise<Folder>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

export default class FolderService implements IFolderService {
  private static instance: FolderService;

  private constructor(private folderStore: StoreOperations<Folder>) {}

  static getInstance() {
    return FolderService.instance;
  }

  static initialize(folderStore: StoreOperations<Folder>) {
    if (!FolderService.instance) {
      FolderService.instance = new FolderService(folderStore);
    }

    return FolderService.instance;
  }

  async get(id: string) {
    return await this.folderStore.get(id);
  }

  async getAll() {
    const folders = (await this.folderStore.getAll())
      .filter((folder) => folder.deleted_at === null)
      .sort((folder, nextFolder) => folder.order - nextFolder.order);

    return folders;
  }

  async getActiveFolders() {
    const folders = (await this.getAll()).filter(
      (folder) => folder.deleted_at === null
    );

    return folders;
  }

  async getDeletedFolders() {
    const folders = (await this.getAll()).filter(
      (folder) => folder.deleted_at !== null
    );

    return folders;
  }

  async populate(folders: Folder[]) {
    for (const folder of folders) {
      await this.folderStore.put(folder);
    }
  }

  async create(data: Folder) {
    const folder = new Folder(data.name, data.color, data.order);
    await this.folderStore.add(folder);

    return folder;
  }

  async update(folder: Folder) {
    folder.updated_at = new Date().toISOString();
    await this.folderStore.put(folder);

    return folder;
  }

  async delete(id: string) {
    await this.folderStore.delete(id);
  }

  async clear() {
    await this.clear();
  }

  async cleanDeletedFolders() {
    const folders = await this.getDeletedFolders();

    for (const folder of folders) {
      const deletedAt = new Date(folder.deleted_at!);
      const deletedDate = adjustDate(deletedAt, 7, "days");
      const now = new Date();

      if (now > deletedDate) {
        await this.folderStore.delete(folder.id);
      }
    }
  }
}
