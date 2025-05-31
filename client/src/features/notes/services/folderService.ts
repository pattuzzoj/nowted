import { StoreOperations } from "@/shared/context/indexedDB";
import { Folder } from "../entities/folder";

export interface IFolderService {
  seedSyncFolders(folders: Folder[]): Promise<void>;
  hasFolder(id: string): Promise<boolean>;
  getFolder(id: string): Promise<Folder>;
  getAllFolders(): Promise<Folder[]>;
  createFolder(folder: Folder): Promise<Folder>;
  updateFolder(folder: Folder): Promise<Folder>;
  deleteFolder(id: string): Promise<void>;
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

  async seedSyncFolders(folders: Folder[]) {
    for (const folder of folders) {
      await this.folderStore.put(folder);
    }
  }

  async hasFolder(id: string) {
    const key = await this.folderStore.getKey(id);
    return Boolean(key);
  }

  async getFolder(id: string) {
    return await this.folderStore.get(id);
  }

  async getAllFolders() {
    const folders = (await this.folderStore.getAll())
      .sort((folder, nextFolder) => folder.order - nextFolder.order);

    return folders;
  }

  async createFolder(data: Folder) {
    const folder = new Folder(data.name, data.color, data.order);
    await this.folderStore.add(folder);

    return folder;
  }

  async updateFolder(folder: Folder) {
    folder.updated_at = new Date().toISOString();
    await this.folderStore.put(folder);

    return folder;
  }

  async deleteFolder(id: string) {
    await this.folderStore.delete(id);
  }
}
