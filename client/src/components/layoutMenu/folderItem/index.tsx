import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { A, useParams } from "@solidjs/router";
import Folder from "lucide-solid/icons/folder";
import FolderOpen from "lucide-solid/icons/folder-open";
import Settings2 from "lucide-solid/icons/settings-2";
import Trash from "lucide-solid/icons/trash";
import Pencil from "lucide-solid/icons/pencil";
import X from "lucide-solid/icons/x";
import Dropdown from "@components/dropdown";
import Backdrop from "@components/backdrop";
import { Folder as IFolder } from "@/types";
import UpdateFolderForm from "@components/form/editNameFolder";
import DeleteFolderForm from "@components/form/deleteFolder";
import { Menu, Dialog } from "@ark-ui/solid";

interface FolderProps extends IFolder { }

export default function FolderItem(props: FolderProps) {
  const params = useParams();

  return (
    <div class="w-full flex items-center">
      <Menu.Root>
        <Menu.ContextTrigger title="Settings Folder" class="w-full">
          <A class="w-full flex justify-between items-center gap-3 p-1.5 rounded-lg hover:bg-link-hover group" href={`/folder/${props.id}`} activeClass="bg-active">
            <span class="flex items-center gap-4">
              <Show when={params.folderId === props.id} fallback={<Folder class="size-4 text-transparent" style={{ fill: props.color }} />}>
                <FolderOpen class="size-4 text-transparent" style={{ fill: props.color }} />
              </Show>
              {props.name}
            </span>
            <Menu.Trigger title="Settings Folder">
              <Settings2 class="size-4" />
            </Menu.Trigger>
          </A>
        </Menu.ContextTrigger>
        <Menu.Positioner>
          <Menu.Content class="space-y-1 w-40 bg-tertiary p-2 rounded-lg z-10">
            <Dialog.Root>
              <Dialog.Trigger title="edit folder" class="w-full flex items-center gap-2 p-2 hover:bg-note-hover rounded-lg">
                <Pencil class="size-4" />
                Edit Folder
              </Dialog.Trigger>
              <Portal>
                <Dialog.Content>
                  <Dialog.Backdrop />
                  <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                    <span class="flex items-center justify-between">
                      <h4 class="font-medium">Folder</h4>
                      <Dialog.CloseTrigger title="close form" class="p-1 rounded-lg hover:bg-red-500/50">
                        <X />
                      </Dialog.CloseTrigger>
                    </span>
                    <UpdateFolderForm {...props} />
                  </div>
                </Dialog.Content>
              </Portal>
            </Dialog.Root>
            <hr class="border-1 text-white/5" />
            <Dialog.Root>
              <Dialog.Trigger title="delete folder" class="w-full flex items-center gap-2 p-2 text-red-400 hover:bg-note-hover rounded-lg">
                <Trash class="size-4" />
                Delete Folder
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Content class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                  <span class="flex items-center justify-between">
                    <h4 class="font-medium">Delete Folder</h4>
                    <Dialog.CloseTrigger title="close form" class="p-1 rounded-lg hover:bg-red-500/50">
                      <X />
                    </Dialog.CloseTrigger>
                  </span>
                  <DeleteFolderForm id={props.id} name={props.name} />
                  <Dialog.CloseTrigger title="close form" class="text-center p-2 rounded-lg bg-tertiary hover:bg-hover -mt-4">
                    Cancel
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Portal>
            </Dialog.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  )
}