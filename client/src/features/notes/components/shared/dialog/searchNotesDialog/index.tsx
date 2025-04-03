import { Dialog } from "@ark-ui/solid";
import SearchIcon from "lucide-solid/icons/search";
import CloseIcon from "lucide-solid/icons/x";
import { Portal } from "solid-js/web";

export default function SearchNotesDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger title="Create Folder" class="flex justify-center items-center btn aspect-square data-[state=open]:bg-blue-700">
        <SearchIcon class="size-5" />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Search</h4>
              <Dialog.CloseTrigger title="close search" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div>
              <input type="text" placeholder="Seach" />
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
}
