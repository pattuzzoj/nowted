import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface ArchiveActionProps extends ParentProps {
  note: Note;
  class?: string;
}

export default function ArchiveAction(props: ArchiveActionProps) {
  const [_data, { archiveNote }] = useData();

  return (
    <Action title="Archive" class={props.class} onClick={async () => await archiveNote(props.note.id)}>
      {props.children}
    </Action>
  )
}
