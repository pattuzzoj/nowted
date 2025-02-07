import { useParams } from "@solidjs/router";
import NoteList from "components/noteList";
import { useData } from "context/data";
import Star from "lucide-solid/icons/star";
import { Show } from "solid-js";
import { createMediaQuery } from "@solid-primitives/media";
import Editor from "components/editor";
import { Splitter } from "@ark-ui/solid/splitter";
import { useAuth } from "context/auth";

export default function Favorites() {
  const [requireAuth] = useAuth();
  requireAuth();
  const [data] = useData();
  const params = useParams();

  const isMobile = createMediaQuery("(max-width: 767px)");
  const isDesktop = createMediaQuery("(min-width: 768px)");

  return (
    <>
      <Show when={isMobile()}>
        <Show when={params.noteId} fallback={<NoteList title={<><Star class="size-5" /> Favorites</>} list={data.favorites} context="favorites" />}>
          <Editor />
        </Show>
      </Show>
      <Show when={isDesktop()}>
        <Show when={data.favorites.length > 0} fallback={(
          <div class="h-screen w-full bg-secondary flex flex-col items-center justify-center text-center gap-4">
            <Star class="size-12" />
            <h2>No favorite notes</h2>
            <p class="max-w-96 text-white/50">You haven't added any notes to favorites yet. Mark important notes for quick access.</p>
          </div>
        )}>
          <Splitter.Root size={[
            { id: "list", size: 30, minSize: 0, maxSize: 40 },
            { id: "editor" }
          ]}>
            <Splitter.Panel id="list">
              <NoteList title={<><Star class="size-5" /> Favorites</>} list={data.favorites} context="favorites" />
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="list:editor">
              <div class="relative h-screen">
                <button title="resize layout" class="h-screen absolute top-1/2 -translate-y-1/2 size-5"></button>
              </div>
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="editor">
              <Show when={params.noteId} fallback={
                <div class="h-screen bg-primary flex flex-col items-center justify-center text-center gap-4">
                  <Star class="size-12" />
                  <h2>No note selected</h2>
                  <p class="max-w-96 text-white/50">Select a favorite note to view or edit. You can easily access your most important notes here.</p>
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