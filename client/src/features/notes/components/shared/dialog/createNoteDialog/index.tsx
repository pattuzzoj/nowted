import { ParentProps } from "solid-js";
import { Portal } from "solid-js/web";
import { Dialog } from "@ark-ui/solid";
import CloseIcon from "lucide-solid/icons/x";
import CreateNoteForm from "../../form/createNoteForm";

export default function CreateNoteDialog(props: ParentProps) {
  return (
    <Dialog.Root>
      {props.children}
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Create note</h4>
              <Dialog.CloseTrigger title="close" class="p-1 rounded-lg hover:bg-red-500/50">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-2">
              <CreateNoteForm />
              <Dialog.CloseTrigger class="dialog-btn dialog-btn-cancel">
                Cancel
              </Dialog.CloseTrigger>
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  )
}
