import { IsOptional } from "class-validator"
import { FolderDto } from "./folder.dto"

export class UpdateFolderDto extends FolderDto {
  @IsOptional()
  id: string
  
  @IsOptional()
  name: string

  @IsOptional()
  order: number
}