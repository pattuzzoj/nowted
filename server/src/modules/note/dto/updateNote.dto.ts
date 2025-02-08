import { IsOptional } from "class-validator";
import { NoteDto } from "./note.dto";

export class UpdateNoteDto extends NoteDto {
  @IsOptional()
  id: string
  
  @IsOptional()
  folder_id: string

  @IsOptional()
  name: string

  @IsOptional()
  content: string
  
  @IsOptional()
  state: string

  @IsOptional()
  favorite: boolean
}