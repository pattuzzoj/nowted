import { IsOptional } from "class-validator";
import { FolderDto } from "./folder.dto";

export class CreateFolderDto extends FolderDto {
  @IsOptional()
  id: string

  @IsOptional()
  order: number
}