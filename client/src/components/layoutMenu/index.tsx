import { createSignal, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { A, useParams } from "@solidjs/router";
import Archive from "lucide-solid/icons/archive";
import Star from "lucide-solid/icons/star";
import Trash from "lucide-solid/icons/trash-2";
import FilePlus from "lucide-solid/icons/file-plus";
import Search from "lucide-solid/icons/search";
import FolderPlus from "lucide-solid/icons/folder-plus";
import X from "lucide-solid/icons/x";
import FileText from "lucide-solid/icons/file-text";
import LogOut from "lucide-solid/icons/log-out";
import FolderItem from "@/components/layoutMenu/folderItem";
import Logo from "@components/logo";
import Backdrop from "@components/backdrop";
import UpdateFolderForm from "@components/form/editNameFolder";
import { useData } from "@context/data";
import { useAuth } from "@context/auth";
import MenuIcon from "lucide-solid/icons/menu";
import { Menu, Dialog } from "@ark-ui/solid";
import { createMediaQuery } from "@solid-primitives/media";

export default function LayoutMenu() {
  const { handleLogout } = useAuth();
  const [data, { noteService }] = useData();
  const params = useParams();
  const isMobile = createMediaQuery("(max-width: 767px)");
  const isDesktop = createMediaQuery("(min-width: 768px)");
  const [menuIsActive, setMenuIsActive] = createSignal(isDesktop());
  const [searchIsActive, setSearchIsActive] = createSignal(false);

  return (
    <>
      <Show when={isMobile()}>
        <>
          <header class="h-1/12 flex justify-between items-center p-2 bg-primary">
            <A class="h-fit w-fit size-25" href="/">
              <Logo />
            </A>
            <button title="Open/Close Menu" class="flex justify-center items-center btn" onClick={() => setMenuIsActive(!menuIsActive())}>
              <Show when={menuIsActive()} fallback={<MenuIcon />}>
                <X />
              </Show>
            </button>
          </header>
          <div class={`${!menuIsActive() && "-translate-x-full"} absolute top-1/12 left-0 z-10 h-11/12 w-full flex flex-col justify-between gap-8 p-2 bg-primary text-white/80 transition duration-500`}>
            <input class="text-center p-2 rounded-lg text-sm bg-tertiary" placeholder="Search Note" />
            <Show when={data.recents.length}>
              <div class="space-y-2">
                <h2 id="folders" class="text-sm">Recents</h2>
                <nav aria-labelledby="folders" class="space-y-1">
                  <For each={data.recents}>
                    {(note) => (
                      <A class="flex justify-start items-center gap-2 btn" href={`/folder/${note.folder_id}/note/${note.id}`} activeClass="bg-active ">
                        <FileText class="size-4" />
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
                <Dialog.Root>
                  <Dialog.Trigger title="create folder" class="flex justify-center items-center btn data-[state=open]:bg-hover">
                    <FolderPlus class="size-5" />
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Content>
                      <Backdrop />
                      <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                        <span class="flex items-center justify-between">
                          <h4 class="font-medium">Folder</h4>
                          <Dialog.CloseTrigger title="close new folder form" class="p-1 rounded-lg hover:bg-red-500/50">
                            <X />
                          </Dialog.CloseTrigger>
                        </span>
                        <UpdateFolderForm />
                      </div>
                    </Dialog.Content>
                  </Portal>
                </Dialog.Root>
              </div>
              <nav aria-labelledby="folders" class="h-5/6 overflow-y-scroll space-y-1">
                <For each={data.folders}>
                  {(folder) => (<FolderItem {...folder} />)}
                </For>
              </nav>
            </div>
            <div class="space-y-2">
              <h2 id="more" class="text-sm">More</h2>
              <nav aria-labelledby="more" class="space-y-1">
                <A class="flex items-center justify-between btn" href="/favorites" activeClass="bg-active">
                  <span class="flex items-center gap-2">
                    <Star class="size-4" />
                    Favorites
                  </span>
                  <span class="flex justify-center items-center bg-primary rounded-lg size-6 text-xs">{data.favorites.length}</span>
                </A>
                <A class="flex items-center justify-between btn" href="/archived" activeClass="bg-active">
                  <span class="flex items-center gap-2">
                    <Archive class="size-4" />
                    Archived
                  </span>
                  <span class="flex justify-center items-center bg-primary rounded-lg size-6 text-xs">{data.archived.length}</span>
                </A>
                <A class="flex items-center justify-between btn" href="/trash" activeClass="bg-active">
                  <span class="flex items-center gap-2">
                    <Trash class="size-4" />
                    Trash
                  </span>
                  <span class="flex justify-center items-center bg-primary rounded-lg size-6 text-xs">{data.trash.length}</span>
                </A>
              </nav>
            </div>
            <button class="flex justify-start items-center gap-2 btn" onClick={handleLogout}>
              <LogOut class="size-4" />
              Log out
            </button>
          </div>
        </>
      </Show>
      <Show when={isDesktop()}>
        <div class={`${!menuIsActive() && "-translate-x-full"} "transition-all duration-500 h-screen w-full max-w-64 flex flex-col justify-between gap-8 p-2 bg-primary text-white/80"`}>
          <div class="flex justify-between items-center">
            <A class="h-fit w-fit size-25" href="/">
              <Logo />
            </A>
            {/* <button title="Open/Close Menu" class="flex justify-center items-center btn" onClick={() => setMenuIsActive(!menuIsActive())}>
              <Show when={menuIsActive()} fallback={<MenuIcon />}>
                <X />
              </Show>
            </button> */}
          </div>
          <input class="text-center p-2 rounded-lg text-sm bg-tertiary" placeholder="Search Note" />
          <Show when={data.recents.length}>
            <div class="space-y-2">
              <h2 id="folders" class="text-sm">Recents</h2>
              <nav aria-labelledby="folders" class="space-y-1">
                <For each={data.recents}>
                  {(note) => (
                    <A class="flex justify-start items-center gap-2 btn" href={`/folder/${note.folder_id}/note/${note.id}`} activeClass="bg-active ">
                      <FileText class="size-4" />
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
              <Dialog.Root>
                <Dialog.Trigger title="create folder" class="flex justify-center items-center btn">
                  <FolderPlus class="size-5" />
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Content>
                    <Backdrop />
                    <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-96 flex flex-col gap-6 p-4 rounded-lg bg-primary border-2 border-white/10">
                      <span class="flex items-center justify-between">
                        <h4 class="font-medium">Folder</h4>
                        <Dialog.CloseTrigger title="close new folder form" class="p-1 rounded-lg hover:bg-red-500/50">
                          <X />
                        </Dialog.CloseTrigger>
                      </span>
                      <UpdateFolderForm />
                    </div>
                  </Dialog.Content>
                </Portal>
              </Dialog.Root>
            </div>
            <nav aria-labelledby="folders" class="h-5/6 overflow-y-scroll space-y-1">
              <For each={data.folders}>
                {(folder) => (<FolderItem {...folder} />)}
              </For>
            </nav>
          </div>
          <div class="space-y-2">
            <h2 id="more" class="text-sm">More</h2>
            <nav aria-labelledby="more" class="space-y-1">
              <A class="flex items-center justify-between btn" href="/favorites" activeClass="bg-active">
                <span class="flex items-center gap-2">
                  <Star class="size-4" />
                  Favorites
                </span>
                <span class="flex justify-center items-center bg-primary rounded-lg size-6 text-xs">{data.favorites.length}</span>
              </A>
              <A class="flex items-center justify-between btn" href="/archived" activeClass="bg-active">
                <span class="flex items-center gap-2">
                  <Archive class="size-4" />
                  Archived
                </span>
                <span class="flex justify-center items-center bg-primary rounded-lg size-6 text-xs">{data.archived.length}</span>
              </A>
              <A class="flex items-center justify-between btn" href="/trash" activeClass="bg-active">
                <span class="flex items-center gap-2">
                  <Trash class="size-4" />
                  Trash
                </span>
                <span class="flex justify-center items-center bg-primary rounded-lg size-6 text-xs">{data.trash.length}</span>
              </A>
            </nav>
          </div>
          <button class="flex justify-start items-center gap-2 btn" onClick={handleLogout}>
            <LogOut class="size-4" />
            Log out
          </button>
        </div>
      </Show>
    </>
  )
}