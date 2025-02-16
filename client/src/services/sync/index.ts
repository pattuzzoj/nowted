import FetchService from "@services/fetch";
import FolderService from "../folder";
import NoteService from "../note";
import { Folder, Note } from "@/types";
import ActionRecordService from "../actionRecord";
import { deepMerge } from "@utilify/core";

export default class SyncService {
  private static instance: SyncService;

  private constructor(
    private fetchService: FetchService,
    private ActionRecordService: ActionRecordService,
    private folderService: FolderService,
    private noteService: NoteService
  ) {}

  public static getInstance(
    fetchService: FetchService,
    ActionRecordService: ActionRecordService,
    folderService: FolderService,
    noteService: NoteService
  ) {
    if (!this.instance) {
      SyncService.instance = new SyncService(
        fetchService,
        ActionRecordService,
        folderService,
        noteService
      );
    }

    return SyncService.instance;
  }

  async syncFetch() {
    const lastSync = localStorage.getItem("lastSync");
    const response = await this.fetchService.get<{ folders: Folder[]; notes: Note[] }>(`/${lastSync}`);

    if (response.status === "error") {
      return response;
    }

    try {
      await this.folderService.populate(response.data.folders);
      await this.noteService.populate(response.data.notes);

      localStorage.setItem("lastSync", new Date(response.timestamp).toISOString());
    } catch (error) {
      return {
        status: "error",
        message: "Internal Error",
        data: null,
      };
    }

    return response;
  }

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

    localStorage.setItem("lastSync", new Date(response.timestamp).toISOString());

    for (const item of actionRecords) {
      await this.ActionRecordService.delete(item.id);
    }

    return response;
  }
}
