import type { Folder } from "./interfaces/folder.interface";

export default abstract class IFolderService {
  abstract getFoldersSinceLastSync(userId: string, lastSync: string): Promise<Folder[]>
  abstract checkIfFolderExists(id: string): Promise<boolean>
  abstract create(folder: Folder): Promise<void>
  abstract update(folder: Folder): Promise<void>
  abstract restore(folder: Folder): Promise<void>
  abstract delete(folder: Folder): Promise<void>
}