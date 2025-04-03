import { createListCollection, Dialog, Select } from "@ark-ui/solid";
import { createMemo, createSignal, For, ParentProps } from "solid-js";
import { Portal } from "solid-js/web";
import CloseIcon from "lucide-solid/icons/x"
import useData from "@/features/notes/hooks/useData";
import ChevronsUpDownIcon from "lucide-solid/icons/chevrons-up-down";
import FolderIcon from "lucide-solid/icons/folder";
import MoveNoteAction from "../../actions/moveNoteAction";
import type { Note } from "@/features/notes/types";

interface MoveNoteDialogProps extends ParentProps {
  note: Note;
}

export default function MoveNoteDialog(props: MoveNoteDialogProps) {
  const [folderId, setFolderId] = createSignal<string>("");
  const [data] = useData();

  const collection = createMemo(() => {
    const items: {
      label: string;
      value: string;
    }[] = [];

    data.folders.forEach((folder) => {
      items.push({
        label: folder.name,
        value: folder.id
      });
    });

    return createListCollection({
      items: items
    })
  });

  return (
    <Dialog.Root>
      {props.children}
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Move Note</h4>
              <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-6">
              <Select.Root defaultValue={[data.folder.id]} collection={collection()} positioning={{ sameWidth: true }} onValueChange={({ value }) => setFolderId(value[0])}>
                <Select.Control>
                  <Select.Trigger class="w-full flex justify-between p-2 rounded-lg bg-layout-tertiary">
                    <span class="flex gap-2">
                      <FolderIcon />
                      <Select.ValueText placeholder="Folder" />
                    </span>
                    <ChevronsUpDownIcon />
                  </Select.Trigger>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content class="absolute top-0 left-0 z-10 w-full flex flex-col gap-2 p-2 bg-layout-primary rounded-lg border-2 border-white/10">
                    <For each={collection().items}>
                      {(item) => (
                        <Select.Item item={item} class="flex justify-between btn cursor-pointer">
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator>✓</Select.ItemIndicator>
                        </Select.Item>
                      )}
                    </For>
                  </Select.Content>
                </Select.Positioner>
                <Select.HiddenSelect />
              </Select.Root>
              <div class="flex flex-col gap-2">
                <MoveNoteAction class="justify-center bg-primary" note={props.note} folderId={folderId()}>
                  Move
                </MoveNoteAction>
                <Dialog.CloseTrigger title="close new folder form" class="dialog-btn dialog-btn-cancel">
                  Cancel
                </Dialog.CloseTrigger>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
}
