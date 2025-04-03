import { createEffect, createSignal, Match, Switch } from 'solid-js';
import { Index } from 'solid-js/web'
import { Editor } from "@tiptap/core";
import { createEditorTransaction } from 'solid-tiptap';
import { Select, createListCollection } from '@ark-ui/solid/select'
import Type from 'lucide-solid/icons/type';
import Heading1 from 'lucide-solid/icons/heading-1';
import Heading2 from 'lucide-solid/icons/heading-2';
import Heading3 from 'lucide-solid/icons/heading-3';
import Heading4 from 'lucide-solid/icons/heading-4';
import Heading5 from 'lucide-solid/icons/heading-5';
import Heading6 from 'lucide-solid/icons/heading-6';
import ChevronsUpDown from 'lucide-solid/icons/chevrons-up-down';

interface TypographProps {
  editor: () => Editor;
}
export default function TypographMenu(props: TypographProps) {
  const [level, setLevel] = createSignal<Level | null>(null);

  const collection = createListCollection({
    items: [
      { label: "Paragraph", value: "null", icon: <Type class="size-5" /> },
      { label: "Headling 1", value: "1", icon: <Heading1 class="size-5" /> },
      { label: "Headling 2", value: "2", icon: <Heading2 class="size-5" /> },
      { label: "Headling 3", value: "3", icon: <Heading3 class="size-5" /> },
      { label: "Headling 4", value: "4", icon: <Heading4 class="size-5" /> },
      { label: "Headling 5", value: "5", icon: <Heading5 class="size-5" /> },
      { label: "Headling 6", value: "6", icon: <Heading6 class="size-5" /> }
    ]
  });

  createEffect(() => {
    createEditorTransaction(props.editor, (editor) => {
      const { level = null } = editor.getAttributes("heading");
      setLevel(level);
    })();
  });

  type Level = 1 | 2 | 3 | 4 | 5 | 6;

  const setHeading = (value: Level) => props.editor().chain().focus().setHeading({ level: value }).run();
  const setParagraph = () => props.editor().chain().focus().setParagraph().run();

  return (
    <div>
      <Select.Root title="Heading" defaultValue={[String(level())]} collection={collection} onValueChange={(e) => e.value[0] === "null" ? setParagraph() : setHeading(Number(e.value[0]) as Level)}>
        <Select.Control>
          <Select.Trigger class="flex justify-between items-center gap-2 btn data-[state=open]:bg-blue-700">
            <Switch fallback={<Type class="size-5" />}>
              <Match when={level() === 1}>
                <Heading1 class="size-5" />
              </Match>
              <Match when={level() === 1}>
                <Heading1 class="size-5" />
              </Match>
              <Match when={level() === 2}>
                <Heading2 class="size-5" />
              </Match>
              <Match when={level() === 3}>
                <Heading3 class="size-5" />
              </Match>
              <Match when={level() === 4}>
                <Heading4 class="size-5" />
              </Match>
              <Match when={level() === 5}>
                <Heading5 class="size-5" />
              </Match>
              <Match when={level() === 6}>
                <Heading6 class="size-5" />
              </Match>
            </Switch>
            <Select.Indicator>
              <ChevronsUpDown class="size-5" />
            </Select.Indicator>
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content class="z-10 w-14 flex items-center flex-col gap-2 p-2 bg-layout-primary rounded-lg border-2 border-white/10">
            <Index each={collection.items}>
              {(item) => (
                <Select.Item item={item()} class="flex items-center btn cursor-pointer">
                  {item().icon}
                </Select.Item>
              )}
            </Index>
          </Select.Content>
        </Select.Positioner>
        <Select.HiddenSelect />
      </Select.Root>
    </div>
  )
}
