import { StoreOperations } from "@/shared/context/indexedDB";
import type { ActionData, ActionEntity, ActionOperation, ActionRecord } from "../types";

export default class ActionRecordService {
  private static instance: ActionRecordService;

  private constructor(private actionRecordStore: StoreOperations<ActionRecord>) {}

  static getInstance() {
    return ActionRecordService.instance;
  }

  static initialize(actionRecordStore: StoreOperations<ActionRecord>) {
    if (!ActionRecordService.instance) {
      ActionRecordService.instance = new ActionRecordService(actionRecordStore);
    }

    return ActionRecordService.instance;
  }

  public async getAll() {
    return await this.actionRecordStore.getAll();
  }

  private async create(type: ActionOperation, entity: ActionEntity, data: ActionData) {
    await this.actionRecordStore.add({
      id: crypto.randomUUID(),
      type,
      entity,
      data,
      timestamp: new Date().toISOString()
    });
  }

  public async add(entity: ActionEntity, data: ActionData) {
    await this.create("create", entity, data);
  }

  public async update(entity: ActionEntity, data: ActionData) {
    await this.create("update", entity, data);
  }

  public async trash(entity: ActionEntity, data: ActionData) {
    await this.create("delete", entity, data);
  }

  public async restore(entity: ActionEntity, data: ActionData) {
    await this.create("restore", entity, data);
  }

  public async delete(id: string) {
    await this.actionRecordStore.delete(id);
  }

  public async clear() {
    await this.actionRecordStore.clear();
  }
}
