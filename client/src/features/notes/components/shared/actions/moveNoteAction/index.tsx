import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface MoveNoteActionProps extends ParentProps {
  note: Note;
  class?: string;
  folderId: string;
}

export default function MoveNoteAction(props: MoveNoteActionProps) {
  const [_data, { moveNote }] = useData();

  return (
    <Action title="Move Note" class={props.class} onClick={async () => await moveNote(props.note.id, props.folderId)}>
      {props.children}
    </Action>
  )
}
