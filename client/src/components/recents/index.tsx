import { For, Show } from "solid-js";
import { useData } from "context/data";
import { A } from "@solidjs/router";
import FileText from "lucide-solid/icons/file-text";

export default function Recents() {
  const [data] = useData();

  return (
    <Show when={data.recents.length}>
      <div class="space-y-2">
        <h2 id="folders" class="text-sm">Recents</h2>
        <nav aria-labelledby="folders" class="-ml-4 space-y-1">
          <For each={data.recents}>
            {(note) => (
              <A class="flex items-center gap-3 p-4 py-1 rounded-r-lg" href={`/folder/${note.folder_id}/note/${note.id}`} activeClass="bg-active">
                <FileText class="size-5" />
                {note.name}
              </A>
            )}
          </For>
        </nav>
      </div>
    </Show>
  )
}