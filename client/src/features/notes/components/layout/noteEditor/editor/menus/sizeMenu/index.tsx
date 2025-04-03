import { createEffect, createSignal, Show } from 'solid-js';
import { Index, Portal } from 'solid-js/web'
import { Editor } from "@tiptap/core";
import { createEditorTransaction } from 'solid-tiptap';
import { Select, createListCollection } from '@ark-ui/solid/select'
import ALargeSmall from 'lucide-solid/icons/a-large-small';
import ChevronsUpDown from 'lucide-solid/icons/chevrons-up-down';

interface TypographProps {
  editor: () => Editor;
}
export default function SizeMenu(props: TypographProps) {
  const [size, setSize] = createSignal<string>();

  const collection = createListCollection({
    items: ["12px", "14px", "16px", "18px", "20px", "24px", "26px", "28px", "30px", "32px", "36px", "48px"]
  });

  createEffect(() => {
    createEditorTransaction(props.editor, (editor) => {
      const { fontSize = "0px" } = editor.getAttributes("textStyle");
      setSize(fontSize);
    })();
  });

  const setTextSize = (value: string) => props.editor().chain().focus().setFontSize(value).run();

  return (
    <Select.Root defaultValue={[String(size())]} collection={collection} onValueChange={(e) => setTextSize(e.value[0])}>
      <Select.Control>
        <Select.Trigger class="flex justify-between items-center gap-2 btn data-[state=open]:bg-blue-700">
          <Show when={size() !== "0px"} fallback={<ALargeSmall class="size-5" />}>
            <Select.ValueText class="text-xs" placeholder="16" />
          </Show>
          <Select.Indicator>
            <ChevronsUpDown class="size-5" />
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content class="flex flex-col justify-between items-center gap-2 btn bg-layout-primary">
            <Index each={collection.items}>
              {(item) => (
                <Select.Item item={item()}>
                  <Select.ItemText class="flex items-center btn text-sm cursor-pointer">{item()}</Select.ItemText>
                </Select.Item>
              )}
            </Index>
          </Select.Content>
        </Select.Positioner>
      </Portal>
      <Select.HiddenSelect />
    </Select.Root>
  )
}
