import { For, JSXElement, ParentProps, Show } from "solid-js";
import Note from "components/note";
import { Note as INote } from "types/interfaces";
import FilePlus from "lucide-solid/icons/file-plus";
import { useParams } from "@solidjs/router";
import { useData } from "context/data";

interface NoteListProps extends ParentProps {
  title: string | JSXElement;
  list: INote[];
  context: "folder" | "favorites" | "archived" | "trash";
}

export default function NoteList(props: NoteListProps) {
  const [_data, {noteService}] = useData();
  const params = useParams();

  let contextHref = (props.context === "folder") ? `/folder/${params.folderId}/note` : `/${props.context}`;

  return (
    <div class="md:min-w-64 md:max-w-xl h-screen md:basis-lg max-md:w-screen flex flex-col p-4 space-y-5 bg-secondary">
      <div class="flex justify-between items-center">
        <h3 class="flex items-center gap-2">{props.title}</h3>
        <Show when={params.folderId}>
          <button title="create note" class="p-2 rounded-lg hover:bg-tertiary" onClick={() => noteService.createNote(params.folderId)}>
            <FilePlus class="size-4"/>
          </button>
        </Show>
      </div>
      <Show when={props.list.length > 0} fallback={props.children}>
        <div class="flex flex-col gap-4 overflow-y-auto">
          <For each={props.list}>
            {(note) => (<Note context={contextHref} {...note}/>)}
          </For>
        </div>
      </Show>
    </div>
  )
}