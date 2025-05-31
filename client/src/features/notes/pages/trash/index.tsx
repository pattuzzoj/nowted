import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createMediaQuery } from "@solid-primitives/media";
import { Splitter } from "@ark-ui/solid/splitter";
import TrashIcon from "lucide-solid/icons/trash-2";
import NoteList from "@/features/notes/components/layout/noteList";
import useData from "@/features/notes/hooks/useData";
import RefreshCcw from "lucide-solid/icons/refresh-ccw";
import { Dialog } from "@ark-ui/solid";
import RestoreNoteDialog from "@/features/notes/components/shared/dialog/restoreNoteDialog";
import ArrowLeftIcon from "lucide-solid/icons/arrow-left";
import EmptyTrash from "./emptyTrash";
import DeleteNoteAction from "@/features/notes/components/shared/actions/deleteNoteAction";

export default function Trash() {
  const [data] = useData();
  const isMobile = createMediaQuery("(max-width: 1023px)");
  const isDesktop = createMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();

  return (
    <>
      <Show when={isMobile()}>
        <Show when={data.note.id} fallback={(
          <NoteList
          title={<><TrashIcon class="size-5" /> Trash</>}
          fallback={<EmptyTrash />}/>
        )}>
          <div class="relative h-screen w-full bg-layout-primary flex flex-col items-center justify-center gap-4 text-center p-2">
            <button title="back" class="absolute top-2 left-2" onClick={() => navigate("/trash")}><ArrowLeftIcon class="size-8"/></button>
            <RefreshCcw class="size-12" />
            <h2>Restore or delete permanently</h2>
            <p class="max-w-96 text-white/50">You can restore this note to bring it back or delete it forever. Once deleted permanently, it cannot be recovered.</p>
            <span class="flex gap-4">
              <RestoreNoteDialog note={data.note}>
                <Dialog.Trigger class="flex items-center gap-2 btn dialog-btn-confirm px-6">
                  <RefreshCcw class="size-4" />
                  Restore
                </Dialog.Trigger>
              </RestoreNoteDialog>
              <DeleteNoteAction class="dialog-btn-confirm-danger px-6" note={data.note}>
                <TrashIcon class="size-4" />
                Delete
              </DeleteNoteAction>
            </span>
          </div>
        </Show>
      </Show>
      <Show when={isDesktop()}>
        <Show when={data.trash.length > 0} fallback={<EmptyTrash/>}>
          <Splitter.Root size={[
            { id: "list", size: 35, minSize: 20, maxSize: 40 },
            { id: "editor", size: 65 }
          ]}>
            <Splitter.Panel id="list">
              <NoteList
                title={<><TrashIcon class="size-5" /> Trash</>}
                />
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="list:editor">
              <div class="relative h-screen">
                <button title="resize layout" class="h-screen absolute top-1/2 -translate-y-1/2 size-5 cursor-col-resize"></button>
              </div>
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="editor">
              <Show when={data.note} fallback={
                <div class="h-screen bg-layout-primary flex flex-col items-center justify-center text-center gap-4">
                  <TrashIcon class="size-12" />
                  <h2>No note selected</h2>
                  <p class="max-w-96 text-white/50">Select a note from the trash to restore it. Deleted notes can only be recovered, not permanently edited.</p>
                </div>
              }>
                <div class="h-screen bg-layout-primary flex flex-col items-center justify-center text-center gap-4">
                  <RefreshCcw class="size-12" />
                  <h2>Restore or delete permanently</h2>
                  <p class="max-w-96 text-white/50">You can restore this note to bring it back or delete it forever. Once deleted permanently, it cannot be recovered.</p>
                  <span class="flex gap-4">
                    <RestoreNoteDialog note={data.note}>
                      <Dialog.Trigger class="flex items-center gap-2 btn btn-primary px-4">
                        <RefreshCcw class="size-4" />
                        Restore
                      </Dialog.Trigger>
                    </RestoreNoteDialog>
                    <DeleteNoteAction class="dialog-btn-confirm-danger px-4" note={data.note}>
                      <TrashIcon class="size-4" />
                      Delete
                    </DeleteNoteAction>
                  </span>
                </div>
              </Show>
            </Splitter.Panel>
          </Splitter.Root>
        </Show>
      </Show>
    </>
  )
}
