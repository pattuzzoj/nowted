import { A, useParams } from "@solidjs/router";
import Archive from "lucide-solid/icons/archive";
import Star from "lucide-solid/icons/star";
import Trash from "lucide-solid/icons/trash-2";
import FilePlus from "lucide-solid/icons/file-plus";
import Search from "lucide-solid/icons/search";
import logo from "assets/logo.svg";
import { createSignal, For, Show } from "solid-js";
import { useData } from "context/data";
import FolderItem from "components/folderItem";
import Dialog from "components/dialog";
import FolderPlus from "lucide-solid/icons/folder-plus";
import { Portal } from "solid-js/web";
import Backdrop from "components/backdrop";
import UpdateFolderForm from "components/form/editNameFolder";
import X from "lucide-solid/icons/x";
import FileText from "lucide-solid/icons/file-text";
import LogOut from "lucide-solid/icons/log-out";

export default function Sidebar() {
  const [isActive, setIsActive] = createSignal(false);
  const [data, { noteService }] = useData();
  const params = useParams();

  return (
    <div class="flex flex-col justify-between gap-8 w-96 h-screen p-4 bg-primary text-white/80">
      <div class="flex justify-between items-center">
        <A class="w-fit" href="/">
          <img class="size-25 h-fit" src={logo} alt="" />
        </A>
        <button title="Search Notes" class="p-2 rounded-lg hover:bg-tertiary" onClick={() => setIsActive(!isActive())}>
          <Search />
        </button>
      </div>
      <Show when={isActive()} fallback={
        <button title="New Note" class="flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-bold bg-tertiary" onClick={() => noteService.createNote(params.folderId)}>
          <FilePlus class="size-4" />
          New Note
        </button>
      }>
        <input class="text-center p-2 rounded-lg text-sm" placeholder="Search Note" />
      </Show>
      <Show when={data.recents.length}>
        <div class="space-y-2">
          <h2 id="folders" class="text-sm">Recents</h2>
          <nav aria-labelledby="folders" class="-ml-4 space-y-1">
            <For each={data.recents}>
              {(note) => (
                <A class="flex items-center gap-3 hover:bg-link-hover p-4 py-1 rounded-r-lg" href={`/folder/${note.folder_id}/note/${note.id}`} activeClass="bg-active">
                  <FileText class="size-5" />
                  {note.name}
                </A>
              )}
            </For>
          </nav>
        </div>
      </Show>
      <div class="h-2/6 grow space-y-2">
        <div class="flex items-center justify-between">
          <h2 id="folders" class="text-sm">Folders</h2>
          <Dialog>
            <Dialog.Trigger action="open" title="create folder" class="p-2 rounded-lg hover:bg-tertiary">
              <FolderPlus class="size-4" />
            </Dialog.Trigger>
            <Portal>
              <Dialog.Content>
                <Backdrop />
                <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                  <span class="flex items-center justify-between">
                    <h4 class="font-medium">Folder</h4>
                    <Dialog.Trigger action="close" title="close new folder form" class="p-1 rounded-lg hover:bg-red-500/50" as={"button"}>
                      <X />
                    </Dialog.Trigger>
                  </span>
                  <UpdateFolderForm />
                </div>
              </Dialog.Content>
            </Portal>
          </Dialog>
        </div>
        <nav aria-labelledby="folders" class="h-5/6 overflow-y-scroll -ml-4 space-y-1">
          <For each={data.folders}>
            {(folder) => (<FolderItem {...folder} />)}
          </For>
        </nav>
      </div>
      <div class="space-y-2">
        <h2 id="more" class="text-sm">More</h2>
        <nav aria-labelledby="more" class="-ml-4 space-y-1">
          <A class="flex items-center justify-between hover:bg-link-hover p-4 py-1 rounded-r-lg" href="/favorites" activeClass="bg-active">
            <span class="flex items-center gap-3">
              <Star class="size-5" />
              Favorites
            </span>
            <span class="flex justify-center items-center bg-accent rounded-full size-5 text-[0.8rem]">{data.favorites.length}</span>
          </A>
          <A class="flex items-center justify-between hover:bg-link-hover p-4 py-1 rounded-r-lg" href="/archived" activeClass="bg-active">
            <span class="flex items-center gap-3">
              <Archive class="size-5" />
              Archived
            </span>
            <span class="flex justify-center items-center bg-accent rounded-full size-5 text-[0.8rem]">{data.archived.length}</span>
          </A>
          <A class="flex items-center justify-between hover:bg-link-hover p-4 py-1 rounded-r-lg" href="/trash" activeClass="bg-active">
            <span class="flex items-center gap-3">
              <Trash class="size-5" />
              Trash
            </span>
            <span class="flex justify-center items-center bg-accent rounded-full size-5 text-[0.8rem]">{data.trash.length}</span>
          </A>
        </nav>
      </div>
      <button class="flex items-center gap-3 -ml-4 p-4 py-1 rounded-r-lg hover:bg-link-hover">
        <LogOut class="size-5"/>
        Log out
      </button>
    </div>
  )
}