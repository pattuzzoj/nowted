import { IsBoolean, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator"
import { Note } from "../note.interface"

export class NoteDto implements Note {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsNotEmpty()
  @IsUUID()
  folder_id: string

  @IsString()
  @MaxLength(48)
  name: string

  @IsString()
  content: string
  
  @IsString()
  state: string

  @IsBoolean()
  favorite: boolean
}