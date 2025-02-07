import { A } from "@solidjs/router";
import { formatDate } from "@utilify/core";
import { useData } from "context/data";
import { Note as INote } from "entities/note";
import Archive from "lucide-solid/icons/archive";
import ArchiveRestore from "lucide-solid/icons/archive-restore";
import RefreshCcw from "lucide-solid/icons/refresh-ccw";
import Star from "lucide-solid/icons/star";
import StarOff from "lucide-solid/icons/star-off";
import Trash from "lucide-solid/icons/trash-2";
import { Show } from "solid-js";

interface NoteProps extends INote {
  context: string;
}

export default function Note(props: NoteProps) {
  const [_data, {noteService}] = useData();
  const date = formatDate(new Date(props.updated_at), "DMY");

  return (
    <div class="relative group">
      <A class="flex flex-col gap-1 p-4 rounded-lg bg-tertiary hover:bg-note-hover group-hover:bg-note-hover" href={`${props.context}/${props.id}`}>
        <span class="flex items-center justify-between text-lg font-medium">
          {props.name}
          <Show when={props.favorite}>
            <Star class="size-5 text-transparent fill-yellow-400"/>
          </Show>
        </span>
        <span class="flex items-center justify-between">
          <span class="text-white/70 line-clamp-1">{props.preview || "preview note"}</span>
          <span class="text-sm">{date}</span>
        </span>
      </A>
      <span class="
      absolute top-0 right-0
      flex items-center gap-2
      opacity-0
      group-hover:opacity-100
      rounded-lg
      mx-3 my-4 transition duration-0 group-hover:duration-200 z-50">
        <button title="Delete Note" class="p-1 rounded-lg hover:text-red-400" onClick={() => {props.deleted_at != null ? noteService.restoreNote(props.id) : noteService.deleteNote(props.id)}}>
          <Show when={props.deleted_at != null} fallback={<Trash class="size-5"/>}>
            <RefreshCcw class="size-5"/>
          </Show>
        </button>
        <button title="Archive Note" class="p-1 rounded-lg hover:text-blue-400" onClick={() => {props.archived ? noteService.unarchiveNote(props.id) : noteService.archiveNote(props.id)}}>
          <Show when={props.archived} fallback={<Archive class="size-5"/>}>
            <ArchiveRestore class="size-5"/>
          </Show>
        </button>
        <button title="Favorite Note" class="p-1 rounded-lg hover:text-yellow-400" onClick={() => {props.favorite ? noteService.unfavoriteNote(props.id) : noteService.favoriteNote(props.id)}}>
          <Show when={props.favorite} fallback={<Star class="size-5"/>}>
            <StarOff class="size-5"/>
          </Show>
        </button>
      </span>
    </div>
  )
}