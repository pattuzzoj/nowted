import { ParentProps } from "solid-js";
import { Portal } from "solid-js/web";
import { Dialog } from "@ark-ui/solid";
import PencilIcon from "lucide-solid/icons/pencil";
import CloseIcon from "lucide-solid/icons/x";
import EditFolderForm from "../../form/editFolderForm";
import type { Folder } from "@/features/notes/types";

interface EditFolderDialogProps extends ParentProps {
  folder: Folder
}

export default function EditFolderDialog(props: EditFolderDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger class="w-full flex items-center gap-2 btn">
        <PencilIcon class="size-4" />
        Edit Folder
      </Dialog.Trigger>
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Edit folder</h4>
              <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-2">
              <EditFolderForm folder={props.folder} />
              <Dialog.CloseTrigger title="close new folder form" class="dialog-btn dialog-btn-cancel">
                Cancel
              </Dialog.CloseTrigger>
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  )
}
