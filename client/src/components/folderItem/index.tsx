import { A, useParams } from "@solidjs/router";
import Folder from "lucide-solid/icons/folder";
import FolderOpen from "lucide-solid/icons/folder-open";
import Settings2 from "lucide-solid/icons/settings-2";
import Trash from "lucide-solid/icons/trash";
import Pencil from "lucide-solid/icons/pencil";
import { Show } from "solid-js";
import Dropdown from "components/dropdown";
import Dialog from "components/dialog";
import { Portal } from "solid-js/web";
import Backdrop from "components/backdrop";
import X from "lucide-solid/icons/x";
import { Folder as IFolder } from "types/interfaces";
import UpdateFolderForm from "components/form/editNameFolder";
import DeleteFolderForm from "components/form/deleteFolder";

interface FolderProps extends IFolder {}

export default function FolderItem(props: FolderProps) {
  const params = useParams();

  return (
    <A class="relative flex justify-between items-center gap-3 px-4 py-1 rounded-r-lg hover:bg-link-hover group" href={`/folder/${props.id}`} activeClass="bg-active">
      <span class="flex items-center gap-4">
        <Show when={params.folderId === props.id} fallback={<Folder class="size-5 text-transparent" style={{fill: props.color}} />}>
          <FolderOpen class="size-5 text-transparent" style={{fill: props.color}} />
        </Show>
        {props.name}
      </span>
      <div class="group-hover:flex hidden items-center">
        <Dropdown>
          <Dropdown.Trigger action="toggle" title="Settings Folder">
            <Settings2 class="size-5" />
          </Dropdown.Trigger>
          <Dropdown.Content>
            <div class="absolute top-full right-0 space-y-1 bg-tertiary p-2 rounded-lg z-10">
              <Dialog>
                <Dialog.Trigger action="open" title="edit name" class="w-full flex items-center gap-2 p-2 hover:bg-note-hover rounded-lg">
                  <Pencil class="size-5"/>
                  Edit Folder
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Content>
                    <Backdrop />
                    <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                      <span class="flex items-center justify-between">
                        <h4 class="font-medium">Folder</h4>
                        <Dialog.Trigger action="close" title="close form" class="p-1 rounded-lg hover:bg-red-500/50">
                          <X />
                        </Dialog.Trigger>
                      </span>
                      <UpdateFolderForm {...props}/>
                    </div>
                  </Dialog.Content>
                </Portal>
              </Dialog>
              <hr class="border-1 text-white/5" />
              <Dialog>
                <Dialog.Trigger action="open" title="delete folder" class="w-full flex items-center gap-2 p-2 text-red-400 hover:bg-note-hover rounded-lg">
                  <Trash class="size-5"/>
                  Delete Folder
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Content>
                    <Backdrop />
                    <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                      <span class="flex items-center justify-between">
                        <h4 class="font-medium">Delete Folder</h4>
                        <Dialog.Trigger action="close" title="close form" class="p-1 rounded-lg hover:bg-red-500/50">
                          <X />
                        </Dialog.Trigger>
                      </span>
                      <DeleteFolderForm id={props.id} name={props.name}/>
                      <Dialog.Trigger action="close" title="close form" class="text-center p-2 rounded-lg bg-tertiary hover:bg-hover -mt-4">
                        Cancel
                      </Dialog.Trigger>
                    </div>
                  </Dialog.Content>
                </Portal>
              </Dialog>
            </div>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </A>
  )
}