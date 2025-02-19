import FetchService from "@services/fetch";
import FolderService from "../folder";
import NoteService from "../note";
import { Folder, Note } from "@/types";
import ActionRecordService from "../actionRecord";
import { deepMerge } from "@utilify/core";
import { Notify } from "@/utils/decorators/notify";
import { messages } from "@/utils/messages";
import { baseURL } from "@/utils/constants";

export default class SyncService {
  private static instance: SyncService;
  private fetchService: FetchService;

  private constructor(
    private ActionRecordService: ActionRecordService,
    private folderService: FolderService,
    private noteService: NoteService
  ) {
    this.fetchService = new FetchService(baseURL.concat("/sync"));
  }

  public static getInstance(
    ActionRecordService: ActionRecordService,
    folderService: FolderService,
    noteService: NoteService
  ) {
    if (!this.instance) {
      SyncService.instance = new SyncService(
        ActionRecordService,
        folderService,
        noteService
      );
    }

    return SyncService.instance;
  }

  private getLastSync() {
    return localStorage.getItem("lastSync");
  }

  private setLastSync(lastSync: string) {
    localStorage.setItem("lastSync", lastSync);
  }

  @Notify(messages.SYNC_ALL)
  async syncFetch() {
    const lastSync = this.getLastSync();
    const response = await this.fetchService.get<{ folders: Folder[]; notes: Note[] }>(`/${lastSync}`);

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
    const nonUpdateRecords = actionRecords.filter((record) => record.type !== "update");
    const updateRecords = actionRecords.filter((record) => record.type === "update");

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
      const sortedUpdates = groupedUpdates.sort((currentRecord, nextRecord) => currentRecord.timestamp - nextRecord.timestamp);
      mergedUpdates.push(deepMerge(...sortedUpdates));
    }

    const synchronizedRecords = [...nonUpdateRecords, ...mergedUpdates];

    if (synchronizedRecords.length < 1) {
      return {
        status: "error"
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
