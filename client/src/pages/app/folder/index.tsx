import NoteList from "components/noteList";
import { useData } from "context/data";
import { Show } from "solid-js";
import FolderOpen from "lucide-solid/icons/folder-open";
import { useParams } from "@solidjs/router";
import Info from "lucide-solid/icons/info";
import { createMediaQuery } from "@solid-primitives/media";
import Editor from "components/editor";
import { Splitter } from '@ark-ui/solid/splitter';
import { useAuth } from "context/auth";

export default function Folder() {
  const [requireAuth] = useAuth();
  requireAuth();
  const [data] = useData();
  const params = useParams();
  const isMobile = createMediaQuery("(max-width: 767px)");
  const isDesktop = createMediaQuery("(min-width: 768px)");

  return (
    <>
      <Show when={isMobile()}>
        <Show when={params.noteId} fallback={
          <NoteList title={data.folder.name} list={data.notes} context="folder">
            <div class="h-10/12 flex flex-col items-center justify-center text-center gap-4 text-white/50">
              <Info class="size-8" />
              <h3>Folder is empty</h3>
            </div>
          </NoteList>
        }>
          <Editor />
        </Show>
      </Show>
      <Show when={isDesktop()}>
        <Splitter.Root size={[
          { id: "list", size: 30, minSize: 0, maxSize: 40 },
          { id: "editor" }
        ]}>
          <Splitter.Panel id="list">
            <NoteList title={data.folder.name} list={data.notes} context="folder">
              <div class="flex-1 flex flex-col items-center justify-center text-center gap-4 text-white/50">
                <Info class="size-8" />
                <h3>Folder is empty</h3>
              </div>
            </NoteList>
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="list:editor">
            <div class="relative h-screen">
              <button title="resize layout" class="h-screen absolute top-1/2 -translate-y-1/2 size-5"></button>
            </div>
          </Splitter.ResizeTrigger>
          <Splitter.Panel id="editor">
            <Show when={params.noteId} fallback={
              <div class="h-screen bg-primary flex flex-col items-center justify-center text-center gap-4">
                <FolderOpen class="size-12" />
                <h2>No note selected</h2>
                <p class="max-w-96 text-white/50">Select a note to view or edit. You can quickly access your saved notes here or create a new one.</p>
              </div>
            }>
              <Editor />
            </Show>
          </Splitter.Panel>
        </Splitter.Root>
      </Show>
    </>
  )
}