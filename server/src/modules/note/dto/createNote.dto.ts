// @ts-nocheck
import { IsOptional } from "class-validator";
import { NoteDto } from "./note.dto";

export class CreateNoteDto extends NoteDto {
  @IsOptional()
  id: string
  
  @IsOptional()
  content: string
  
  @IsOptional()
  state: string

  @IsOptional()
  favorite: boolean
}