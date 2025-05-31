import { Show } from "solid-js";
import { createMediaQuery } from "@solid-primitives/media";
import { Splitter } from "@ark-ui/solid/splitter";
import Archive from "lucide-solid/icons/archive";
import NoteList from "@/features/notes/components/layout/noteList";
import useData from "@/features/notes/hooks/useData";
import NoteEditor from "@/features/notes/components/layout/noteEditor";
import EmptyArchived from "./emptyArchived";

export default function Archived() {
  const [data] = useData();
  const isMobile = createMediaQuery("(max-width: 1023px)");
  const isDesktop = createMediaQuery("(min-width: 1024px)");

  return (
    <>
      <Show when={isMobile()}>
        <Show when={data.note.id} fallback={
          <NoteList
            title={<><Archive class="size-5" /> Archived</>}
            fallback={<EmptyArchived />}
          />
        }>
          <NoteEditor />
        </Show>
      </Show>
      <Show when={isDesktop()}>
        <Show when={data.archived.length > 0} fallback={<EmptyArchived/>}>
          <Splitter.Root size={[
            { id: "list", size: 35, minSize: 20, maxSize: 40 },
            { id: "editor", size: 65 }
          ]}>
            <Splitter.Panel id="list">
              <NoteList
                title={<><Archive class="size-5" /> Archived</>}
              />
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="list:editor">
              <div class="relative h-screen">
                <button title="resize layout" class="h-screen absolute top-1/2 -translate-y-1/2 size-5 cursor-col-resize"></button>
              </div>
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="editor">
              <Show when={data.note && data.note.archived} fallback={
                <div class="h-screen bg-layout-primary flex flex-col items-center justify-center text-center gap-4">
                  <Archive class="size-12" />
                  <h2>No note selected</h2>
                  <p class="max-w-96 text-white/50">Select an archived note to view or edit. These notes are kept for reference, but not in your main view.</p>
                </div>
              }>
                <NoteEditor />
              </Show>
            </Splitter.Panel>
          </Splitter.Root>
        </Show>
      </Show>
    </>
  )
}
