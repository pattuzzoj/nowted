import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface DeleteNoteActionProps extends ParentProps {
  note: Note;
  class?: string;
}

export default function DeleteNoteAction(props: DeleteNoteActionProps) {
  const [_data, { deleteNote }] = useData();

  return (
    <Action title="Delete Note" class={props.class} onClick={async () => await deleteNote(props.note.id)}>
      {props.children}
    </Action>
  )
}
