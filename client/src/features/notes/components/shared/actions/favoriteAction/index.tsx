import { ParentProps } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import Action from "../action";
import type { Note } from "@/features/notes/types";

interface FavoriteActionProps extends ParentProps {
  note: Note;
  class?: string;
}

export default function FavoriteAction(props: FavoriteActionProps) {
  const [_data, { favoriteNote }] = useData();

  return (
    <Action title="Favorite" class={props.class} onClick={async () => await favoriteNote(props.note.id)}>
      {props.children}
    </Action>
  )
}
