import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { formatDate } from "@utilify/core";
import Archive from "lucide-solid/icons/archive";
import ArchiveRestore from "lucide-solid/icons/archive-restore";
import Star from "lucide-solid/icons/star";
import StarOff from "lucide-solid/icons/star-off";
import Trash from "lucide-solid/icons/trash-2";
import useData from "@/features/notes/hooks/useData";
import type { Note as INote } from "@/features/notes/entities/note";
import FavoriteAction from "@/features/notes/components/shared/actions/favoriteAction";
import UnfavoriteAction from "@/features/notes/components/shared/actions/unfavoriteAction";
import ArchiveAction from "@/features/notes/components/shared/actions/archiveAction";
import UnarchiveAction from "@/features/notes/components/shared/actions/unarchiveAction";
import TrashNoteAction from "@/features/notes/components/shared/actions/trashNoteAction";
import { Menu } from "@ark-ui/solid";
import NoteMenu from "@/features/notes/components/shared/menu/noteMenu";

interface NoteProps extends INote {
  context: string;
}

export default function Note(props: NoteProps) {
  const [data] = useData();
  const date = formatDate(new Date(props.updated_at), "DMY");

  return (
    <NoteMenu note={props}>
      <Menu.ContextTrigger>
        <div class="relative group">
          <A class={`flex flex-col gap-4 p-4 rounded-2xl ${(data.note.id === props.id) ? "bg-blue-700" : "bg-layout-tertiary group-hover:bg-note-hover"}`} href={`${props.context}/${props.id}`}>
            <span class="flex items-center justify-between text-lg font-medium">
              {props.name}
              <Show when={props.favorite}>
                <Star class="size-4 text-transparent fill-yellow-400" />
              </Show>
            </span>
            <span class="flex items-center justify-between gap-2">
              <span class="text-white/70 line-clamp-1">{props.preview || "preview note"}</span>
              <span class="text-sm">{date}</span>
            </span>
          </A>
          <Show when={!props.context.includes("trash")}>
            <span class="
            absolute top-0 right-0
            flex items-center gap-2
            opacity-0
            group-hover:opacity-100
            rounded-lg
            h-8
            mx-2.5 my-4 transition duration-0 group-hover:duration-200 z-50">
              <TrashNoteAction note={props}>
                <Trash class="size-4" />
              </TrashNoteAction>
              <Show when={props.archived} fallback={
                <ArchiveAction note={props}>
                  <Archive class="size-4" />
                </ArchiveAction>
              }>
                <UnarchiveAction note={props}>
                  <ArchiveRestore class="size-4" />
                </UnarchiveAction>
              </Show>
              <Show when={props.favorite} fallback={
                <FavoriteAction note={props}>
                  <Star class="size-4" />
                </FavoriteAction>
              }>
                <UnfavoriteAction note={props}>
                  <StarOff class="size-4" />
                </UnfavoriteAction>
              </Show>
            </span>
          </Show>
        </div>
      </Menu.ContextTrigger>
    </NoteMenu>
  )
}
