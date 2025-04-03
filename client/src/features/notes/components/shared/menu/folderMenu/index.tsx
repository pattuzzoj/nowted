import { ParentProps } from "solid-js";
import { Menu } from "@ark-ui/solid";
import EditFolderDialog from "@/features/notes/components/shared/dialog/editFolderDialog";
import DeleteFolderDialog from "@/features/notes/components/shared/dialog/deleteFolderDialog";
import type { Folder } from "@/features/notes/types";

interface FolderMenuProps extends ParentProps {
  folder: Folder
}

export default function FolderMenu(props: FolderMenuProps) {
  return (
    <Menu.Root>
      {props.children}
      <Menu.Positioner>
        <Menu.Content class="z-10 flex flex-col gap-1 p-2 rounded-lg bg-layout-tertiary">
          <EditFolderDialog folder={props.folder} />
          <hr class="border-1 text-white/5" />
          <DeleteFolderDialog folder={props.folder} />
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
