import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface TrashNoteActionProps extends ParentProps {
  note: Note;
  class?: string;
}

export default function TrashNoteAction(props: TrashNoteActionProps) {
  const [_data, { trashNote }] = useData();

  return (
    <Action title="TrashNote" class={props.class} onClick={async () => await trashNote(props.note.id)}>
      {props.children}
    </Action>
  )
}
