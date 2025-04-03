import { Portal } from "solid-js/web";
import { Dialog } from "@ark-ui/solid";
import TrashIcon from "lucide-solid/icons/trash";
import CloseIcon from "lucide-solid/icons/x";
import DeleteFolderForm from "../../form/deleteFolderForm";
import type { Folder } from "@/features/notes/types";

interface DeleteFolderFormProps {
  folder: Folder
}

export default function DeleteFolderDialog(props: DeleteFolderFormProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger class="w-full flex items-center gap-2 btn text-red-400">
        <TrashIcon class="size-4" />
        Delete Folder
      </Dialog.Trigger>
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Delete folder</h4>
              <Dialog.CloseTrigger title="close" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-2">
              <DeleteFolderForm folder={props.folder} />
              <Dialog.CloseTrigger title="cancel" class="w-full dialog-btn dialog-btn-cancel">
                Cancel
              </Dialog.CloseTrigger>
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  )
}
