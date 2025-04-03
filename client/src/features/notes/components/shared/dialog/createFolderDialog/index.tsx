import { Portal } from "solid-js/web";
import { Dialog } from "@ark-ui/solid";
import FolderPlusIcon from "lucide-solid/icons/folder-plus";
import CloseIcon from "lucide-solid/icons/x";
import CreateFolderForm from "../../form/createFolderForm";

export default function CreateFolderDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger title="Create Folder" class="flex justify-center items-center btn data-[state=open]:bg-blue-700">
        <FolderPlusIcon class="size-5" />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Content class="m-10">
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Create folder</h4>
              <Dialog.CloseTrigger title="close new folder form" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-2">
              <CreateFolderForm />
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
