import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface UnfavoriteActionProps extends ParentProps {
  note: Note;
  class?: string;
}

export default function UnfavoriteAction(props: UnfavoriteActionProps) {
  const [_data, { unfavoriteNote }] = useData();

  return (
    <Action title="Unfavorite" class={props.class} onClick={async () => await unfavoriteNote(props.note.id)}>
      {props.children}
    </Action>
  )
}
