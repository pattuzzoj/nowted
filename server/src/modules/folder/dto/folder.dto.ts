// @ts-nocheck
import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength } from "class-validator";
import type { Folder } from "../interface/folder.interface";

export class FolderDto implements Folder {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(24)
  name: string

  @IsNotEmpty()
  @IsNumber()
  order: number
}