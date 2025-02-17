import { adjustDate } from "@utilify/core";
import { StoreOperations } from "@context/indexedDB";
import { Folder } from "@entities/folder";
import ActionRecordService from "../actionRecord";
import { Notify } from "@/utils/notify";
import { messages } from "@/utils/messages";

export default class FolderService {
  private static instance: FolderService;

  private constructor(
    private folderStore: StoreOperations<Folder>,
    private actionRecordService: ActionRecordService
  ) {}

  public static getInstance(
    folderStore: StoreOperations<Folder>,
    actionRecordService: ActionRecordService
  ) {
    if(!FolderService.instance) {
      FolderService.instance = new FolderService(folderStore, actionRecordService);
    }

    return FolderService.instance;
  }

  async get(id: string) {
    return await this.folderStore.get(id);
  }

  async getAll() {
    return await this.folderStore.getAll();
  }

  async getDeletedFolders() {
    const folders = await this.getAll();
    return folders.filter((folder) => folder.deleted_at !== null);
  }

  async populate(folders: Folder[]) {
    for (const folder of folders) {
      await this.folderStore.put(folder);
    }
  }

  @Notify(messages.CREATE_FOLDER)
  async create(data: Folder) {
    const folder = new Folder(data.name, data.color, data.order);
    await this.folderStore.add(folder);
    await this.actionRecordService.create("create", "folder", folder);
    
    return folder;
  }

  @Notify(messages.UPDATE_FOLDER)
  async update(folder: Folder) {
    folder.updated_at = new Date().toISOString();
    await this.folderStore.put(folder);
    await this.actionRecordService.create("update", "folder", folder);

    return folder;
  }

  @Notify(messages.DELETE_FOLDER)
  async delete(id: string) {
    const folder = await this.get(id);
    folder.updated_at = folder.deleted_at = new Date().toISOString();
    await this.folderStore.put(folder);

    await this.actionRecordService.create("delete", "folder", {
      id: folder.id,
      updated_at: folder.updated_at,
      deleted_at: folder.deleted_at
    });

    return folder;
  }

  @Notify(messages.RESTORE_FOLDER)
  async restore(id: string) {
    const folder = await this.folderStore.get(id);
    folder.updated_at = new Date().toISOString();
    folder.deleted_at = null;
    await this.folderStore.put(folder);

    await this.actionRecordService.create("restore", "folder", {
      id: folder.id,
      updated_at: folder.updated_at,
      deleted_at: folder.deleted_at
    });

    return folder;
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
      
      if(now > deletedDate) {
        await this.folderStore.delete(folder.id);
      }
    }
  }
}