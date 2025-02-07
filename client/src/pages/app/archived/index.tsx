import { Splitter } from "@ark-ui/solid/splitter";
import { createMediaQuery } from "@solid-primitives/media";
import { useParams } from "@solidjs/router";
import Editor from "components/editor";
import NoteList from "components/noteList";
import { useData } from "context/data";
import Archive from "lucide-solid/icons/archive";
import { Show } from "solid-js";

export default function Archived() {
  const [data] = useData();
  const params = useParams();
  const isMobile = createMediaQuery("(max-width: 767px)");
  const isDesktop = createMediaQuery("(min-width: 768px)");

  return (
    <>
      <Show when={isMobile()}>
        <Show when={params.noteId} fallback={<NoteList title={<><Archive class="size-5" /> Archived</>} list={data.archived} context="archived" />}>
          <Editor />
        </Show>
      </Show>
      <Show when={isDesktop()}>
        <Show when={data.archived.length > 0} fallback={(
          <div class="h-screen w-full bg-secondary flex flex-col items-center justify-center text-center gap-4">
            <Archive class="size-12" />
            <h2>No archived notes</h2>
            <p class="max-w-96 text-white/50">There are no archived notes. Archive notes to hide them without deleting permanently.</p>
          </div>
        )}>
          <Splitter.Root size={[
            { id: "list", size: 30, minSize: 0, maxSize: 40 },
            { id: "editor" }
          ]}>
            <Splitter.Panel id="list">
              <NoteList title={<><Archive class="size-5" /> Archived</>} list={data.archived} context="archived" />
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="list:editor">
              <div class="relative h-screen">
                <button title="resize layout" class="h-screen absolute top-1/2 -translate-y-1/2 size-5"></button>
              </div>
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="editor">
              <Show when={params.noteId} fallback={
                <div class="h-screen bg-primary flex flex-col items-center justify-center text-center gap-4">
                  <Archive class="size-12" />
                  <h2>No note selected</h2>
                  <p class="max-w-96 text-white/50">Select an archived note to view or edit. These notes are kept for reference, but not in your main view.</p>
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