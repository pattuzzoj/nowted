import { Dialog, Menu } from "@ark-ui/solid";
import { ParentProps, Show } from "solid-js";
import StarIcon from "lucide-solid/icons/star";
import ArchiveIcon from "lucide-solid/icons/archive";
import TrashIcon from "lucide-solid/icons/trash";
import StarOffIcon from "lucide-solid/icons/star-off";
import ArchiveRestoreIcon from "lucide-solid/icons/archive-restore";
import FolderIcon from "lucide-solid/icons/folder";
import FavoriteAction from "../../actions/favoriteAction";
import UnfavoriteAction from "../../actions/unfavoriteAction";
import TrashNoteAction from "../../actions/trashNoteAction";
import ArchiveAction from "../../actions/archiveAction";
import UnarchiveAction from "../../actions/unarchiveAction";
import MoveNoteDialog from "../../dialog/moveNoteDialog";
import type { Note } from "@/features/notes/types";

interface NoteMenuProps extends ParentProps {
  note: Note
}

export default function NoteMenu(props: NoteMenuProps) {
  return (
    <Menu.Root>
      {props.children}
      <Menu.Positioner>
        <Menu.Content class="z-10 flex flex-col gap-1 p-2 rounded-lg bg-layout-tertiary">
          <Show when={props.note.favorite} fallback={
            <FavoriteAction note={props.note}>
              <StarIcon class="size-4" />
              Favorite
            </FavoriteAction>
          }>
            <UnfavoriteAction note={props.note}>
              <StarOffIcon class="size-4" />
              Unfavorite
            </UnfavoriteAction>
          </Show>
          <Show when={props.note.archived} fallback={
            <ArchiveAction note={props.note}>
              <ArchiveIcon class="size-4" />
              Archive
            </ArchiveAction>
          }>
            <UnarchiveAction note={props.note}>
              <ArchiveRestoreIcon class="size-4" />
              Unarchive
            </UnarchiveAction>
          </Show>
          <hr class="border-1 text-white/5" />
          <MoveNoteDialog note={props.note}>
            <Dialog.Trigger class="w-full flex items-center gap-2 btn">
              <FolderIcon class="size-4" />
              Change Folder
            </Dialog.Trigger>
          </MoveNoteDialog>
          <hr class="border-1 text-white/5" />
          <TrashNoteAction note={props.note} class="text-red-400 active:text-inherit">
            <TrashIcon class="size-4" />
            Trash
          </TrashNoteAction>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
