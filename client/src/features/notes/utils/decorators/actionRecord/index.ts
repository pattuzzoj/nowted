import ActionRecordService from "@/features/notes/services/actionRecordService";
import { ActionEntity, ActionOperation } from "@/features/notes/types";

const userActionService = ActionRecordService.getInstance();

export function ActionRecord(type: ActionOperation, entity: ActionEntity) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      await userActionService.create(type, entity, result);
      return result;
    };

    return descriptor;
  };
}
