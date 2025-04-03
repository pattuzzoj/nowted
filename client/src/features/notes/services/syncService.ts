import { deepMerge } from "@utilify/core";
import FetchService from "@/shared/services/fetchService";
import { Notify } from "@/shared/utils/decorators/notify";
import { messages } from "@/shared/utils/messages";
import { baseURL } from "@/shared/utils/constants";
import FolderService from "./folderService";
import NoteService from "./noteService";
import ActionRecordService from "./actionRecordService";
import type { Folder, Note } from "../types";

export default class SyncService {
  private static instance: SyncService;
  private fetchService: FetchService;
  private folderService: FolderService;
  private noteService: NoteService;
  private ActionRecordService: ActionRecordService;

  private constructor() {
    this.fetchService = new FetchService(baseURL.concat("/sync"));
    this.folderService = FolderService.getInstance();
    this.noteService = NoteService.getInstance();
    this.ActionRecordService = ActionRecordService.getInstance();
  }

  public static getInstance() {
    if (!this.instance) {
      SyncService.instance = new SyncService();
    }

    return SyncService.instance;
  }

  private getLastSync() {
    return localStorage.getItem("lastSync") || new Date("0").toISOString();
  }

  private setLastSync(lastSync: string) {
    localStorage.setItem("lastSync", lastSync);
  }

  @Notify(messages.SYNC_ALL)
  async syncFetch() {
    const lastSync = this.getLastSync();
    const response = await this.fetchService.get<{
      folders: Folder[];
      notes: Note[];
    }>(`/${lastSync}`);

    if (response.status === "error") {
      return response;
    }

    try {
      await this.folderService.populate(response.data.folders);
      await this.noteService.populate(response.data.notes);

      this.setLastSync(response.timestamp);
    } catch (error) {
      return {
        status: "error",
        message: "Internal Error",
        data: null,
      };
    }

    return response;
  }

  @Notify(messages.SYNC_ALL)
  async syncPush() {
    const actionRecords = await this.ActionRecordService.getAll();
    const nonUpdateRecords = actionRecords.filter(
      (record) => record.type !== "update"
    );
    const updateRecords = actionRecords.filter(
      (record) => record.type === "update"
    );

    const updatesGroupedById = {};

    for (const updateRecord of updateRecords) {
      const recordId = updateRecord.data.id;

      if (!(recordId in updatesGroupedById)) {
        updatesGroupedById[recordId] = [updateRecord];
        continue;
      }

      updatesGroupedById[recordId].push(updateRecord);
    }

    const mergedUpdates = [];

    for (const groupedUpdates of Object.values(updatesGroupedById)) {
      const sortedUpdates = groupedUpdates.sort((currentRecord, nextRecord) => {
        return (
          new Date(currentRecord.timestamp).getTime() -
          new Date(nextRecord.timestamp).getTime()
        );
      });
      mergedUpdates.push(deepMerge(...sortedUpdates));
    }

    const synchronizedRecords = [...nonUpdateRecords, ...mergedUpdates];

    if (synchronizedRecords.length < 1) {
      return {
        status: "error",
      };
    }

    const response = await this.fetchService.post("", synchronizedRecords);

    if (response.status === "error") {
      return response;
    }

    this.setLastSync(response.timestamp);

    for (const item of actionRecords) {
      await this.ActionRecordService.delete(item.id);
    }

    return response;
  }
}
