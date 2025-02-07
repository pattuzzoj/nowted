import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Task } from "../sync.interface";

export class SyncDto implements Task {
  @IsNotEmpty()
  @IsString()
  entity: "folder" | "note"

  @IsNotEmpty()
  @IsString()
  type: "create" | "update" | "delete" | "restore"

  @IsNotEmpty()
  @IsObject()
  data: Record<string, any>
}