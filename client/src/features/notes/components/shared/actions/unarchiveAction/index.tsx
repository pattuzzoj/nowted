import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface UnarchiveActionProps extends ParentProps {
  note: Note;
  class?: string;
}

export default function UnarchiveAction(props: UnarchiveActionProps) {
  const [_data, { unarchiveNote }] = useData();

  return (
    <Action title="Unarchive" class={props.class} onClick={async () => await unarchiveNote(props.note.id)}>
      {props.children}
    </Action>
  )
}
