import { Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { createMediaQuery } from "@solid-primitives/media";
import { Splitter } from "@ark-ui/solid/splitter";
import TrashIcon from "lucide-solid/icons/trash-2";
import Editor from "@components/editor";
import NoteList from "@components/noteList";
import { useData } from "@context/data";

export default function Trash() {
  const [data] = useData();
  const params = useParams();

  const isMobile = createMediaQuery("(max-width: 767px)");
  const isDesktop = createMediaQuery("(min-width: 768px)");

  return (
    <>
      <Show when={isMobile()}>
        <Show when={params.noteId} fallback={<NoteList title={<><TrashIcon class="size-5" /> Trash</>} list={data.trash} context="trash" />
        }>
          <Editor />
        </Show>
      </Show>
      <Show when={isDesktop()}>
        <Show when={data.trash.length > 0} fallback={(
          <div class="h-screen w-full bg-secondary flex flex-col items-center justify-center text-center gap-4">
            <TrashIcon class="size-12" />
            <h2>Trash is empty</h2>
            <p class="max-w-96 text-white/50">No deleted notes found. Removed notes will appear here before permanent deletion.</p>
          </div>
        )}>
          <Splitter.Root size={[
            { id: "list", size: 30, minSize: 0, maxSize: 40 },
            { id: "editor" }
          ]}>
            <Splitter.Panel id="list">
              <NoteList title={<><TrashIcon class="size-5" /> Trash</>} list={data.trash} context="trash" />
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="list:editor">
              <div class="relative h-screen">
                <button title="resize layout" class="h-screen absolute top-1/2 -translate-y-1/2 size-5"></button>
              </div>
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="editor">
              <Show when={params.noteId} fallback={
                <div class="h-screen bg-primary flex flex-col items-center justify-center text-center gap-4">
                  <TrashIcon class="size-12" />
                  <h2>No note selected</h2>
                  <p class="max-w-96 text-white/50">Select a note from the trash to restore it. Deleted notes can only be recovered, not permanently edited.</p>
                </div>
              }>
                <Editor />
              </Show>
            </Splitter.Panel>
          </Splitter.Root>
        </Show>
      </Show>
    </>
  )
}