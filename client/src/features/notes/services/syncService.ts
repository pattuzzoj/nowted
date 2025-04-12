import { deepMerge } from "@utilify/core";
import { Notify } from "@/shared/utils/decorators/notify";
import { messages } from "@/shared/utils/messages";
import FolderService from "./folderService";
import NoteService from "./noteService";
import ActionRecordService from "./actionRecordService";
import type { Folder, Note } from "../types";
import api from "@/shared/services/api";

export default class SyncService {
  private static instance: SyncService;
  private baseURL = "/sync";
  private folderService: FolderService;
  private noteService: NoteService;
  private ActionRecordService: ActionRecordService;

  private constructor() {
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

  private setLastSync() {
    localStorage.setItem("lastSync", new Date().toISOString());
  }

  @Notify(messages.SYNC_ALL)
  async syncFetch() {
    const lastSync = this.getLastSync();
    const {data} = await api.get<{
      folders: Folder[];
      notes: Note[];
    }>(`${this.baseURL}/${lastSync}`);

    this.setLastSync();

    await this.folderService.populate(data.folders);
    await this.noteService.populate(data.notes);

    return data;
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

    const {data} = await api.post(this.baseURL, synchronizedRecords);

    this.setLastSync();

    for (const item of actionRecords) {
      await this.ActionRecordService.delete(item.id);
    }

    return data;
  }
}
