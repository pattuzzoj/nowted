import { StoreOperations } from "@/context/indexedDB";
import type { ActionData, ActionEntity, ActionOperation, ActionRecord } from "@/types";

export default class ActionRecordService {
  private static instance: ActionRecordService;

  private constructor(private actionRecordStore: StoreOperations<ActionRecord>) {}

  static getInstance(actionRecordStore: StoreOperations<ActionRecord>) {
    if (!ActionRecordService.instance) {
      ActionRecordService.instance = new ActionRecordService(actionRecordStore);
    }

    return ActionRecordService.instance;
  }

  public async create(type: ActionOperation, entity: ActionEntity, data: ActionData) {
    await this.actionRecordStore.add({
      id: crypto.randomUUID(),
      type,
      entity,
      data,
      timestamp: Date.now()
    })
  }

  public async getAll() {
    return await this.actionRecordStore.getAll();
  }

  public async delete(id: string) {
    await this.actionRecordStore.delete(id);
  }

  public async clear() {
    await this.actionRecordStore.clear();
  }
}