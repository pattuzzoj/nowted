import { A } from "@solidjs/router";
import FileTextIcon from "lucide-solid/icons/file-text";
import type { Note as NoteProps } from "@/features/notes/types";

export default function RecentItem(props: NoteProps) {
  return (
    <A class="flex justify-start items-center gap-2 btn" href={`/folder/${props.folder_id}/note/${props.id}`} activeClass="bg-blue-700">
      <FileTextIcon class="size-4" />
      {props.name}
    </A>
  )
}
