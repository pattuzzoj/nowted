import { For, JSXElement, ParentProps, Show } from "solid-js";
import Note from "@/features/notes/components/layout/noteList/note";
import useData from "@/features/notes/hooks/useData";
import CreateNoteDialog from "../../shared/dialog/createNoteDialog";
import { Dialog } from "@ark-ui/solid";
import FilePlusIcon from "lucide-solid/icons/file-plus";

interface NoteListProps extends ParentProps {
  title: string | JSXElement;
  fallback?: JSXElement;
}

export default function NoteList(props: NoteListProps) {
  const [data] = useData();

  let contextHref = () => (data.context === "folder") ? `/folder/${data.folder?.id}/note` : `/${data.context}`;

  return (
    <section class="md:min-w-64 h-full md:h-screen w-full flex flex-col gap-5 p-2 bg-layout-secondary">
      <header class="flex justify-between items-center">
        <h3 class="flex items-center gap-2">{props.title}</h3>
        <Show when={data.context === "folder"}>
          <CreateNoteDialog>
            <Dialog.Trigger title="Create Note" class="flex justify-center items-center btn aspect-square data-[state=open]:bg-blue-700">
              <FilePlusIcon class="size-5" />
            </Dialog.Trigger>
          </CreateNoteDialog>
        </Show>
      </header>
      <Show when={data.notes.length > 0} fallback={props.fallback}>
        <div class="flex flex-col gap-4 overflow-y-auto">
          <For each={data.notes}>
            {(note) => (<Note context={contextHref()} {...note} />)}
          </For>
        </div>
      </Show>
    </section>
  )
}
