import { createEffect, createSignal, Show } from "solid-js";
import { A, useIsRouting } from "@solidjs/router";
import X from "lucide-solid/icons/x";
import Logo from "@/features/notes/components/layout/sidebar/shared/logo";
import MenuIcon from "lucide-solid/icons/menu";
import { createMediaQuery } from "@solid-primitives/media";
import Folders from "./shared/folderList";
import More from "./shared/more";
import Recents from "./shared/recentList";
import Search from "./shared/search";
import NewNote from "./desktopSidebar/newNote";
import Profile from "./shared/profileMenu";


export default function Sidebar() {
  const isMobile = createMediaQuery("(max-width: 767px)");
  const isDesktop = createMediaQuery("(min-width: 768px)");
  const [menuIsActive, setMenuIsActive] = createSignal(isDesktop());

  if (isMobile()) {
    const isRouting = useIsRouting();

    createEffect(() => {
      if (isRouting()) {
        setMenuIsActive(false);
      }
    });
  }

  return (
    <>
      <Show when={isMobile()}>
        <div class="relative">
          <header class="flex justify-between items-center p-2 bg-layout-primary">
            <A class="block w-26" href="/">
              <Logo />
            </A>
            <button title="Open/Close Menu" class="flex justify-center items-center btn" onClick={() => setMenuIsActive(!menuIsActive())}>
              <Show when={menuIsActive()} fallback={<MenuIcon />}>
                <X />
              </Show>
            </button>
          </header>
          <div class={`${!menuIsActive() && "-translate-x-full"} absolute top-0 left-0 z-10 h-screen w-2/3 max-w-64 flex flex-col justify-between gap-8 p-2 bg-layout-primary text-white/80 transition duration-500`}>
            <A class="block w-26" href="/">
              <Logo />
            </A>
            <input class="text-center p-2 rounded-lg text-sm bg-layout-tertiary" placeholder="Search Note" />
            <div class="grow flex flex-col gap-8">
              <Recents />
              <Folders />
            </div>
            <div class="flex flex-col gap-6">
              <More />
              <Profile />
            </div>
          </div>
        </div>
      </Show>
      <Show when={isDesktop()}>
        <div class="h-screen w-full overflow-y-scroll min-w-64 max-w-64 flex flex-col justify-between gap-8 p-2 bg-layout-primary">
          <div class="grow flex flex-col gap-8">
            <header class="flex justify-between">
              <A class="block w-26" href="/">
                <Logo />
              </A>
              <Search />
            </header>
            <NewNote />
            <Recents />
            <Folders />
          </div>
          <div class="flex flex-col gap-6">
            <More />
            <Profile />
          </div>
        </div>
      </Show>
    </>
  )
}
