import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface RestoreActionProps extends ParentProps {
  note: Note;
  class?: string;
  folderId: string;
}

export default function RestoreAction(props: RestoreActionProps) {
  const [_data, { restoreNote }] = useData();

  return (
    <Action title="Restore" class={props.class} onClick={async () => await restoreNote(props.note.id, props.folderId)}>
      {props.children}
    </Action>
  )
}
