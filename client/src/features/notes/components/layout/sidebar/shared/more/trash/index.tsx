import useData from "@/features/notes/hooks/useData";
import { Menu } from "@ark-ui/solid";
import { A } from "@solidjs/router";
import Ellipsis from "lucide-solid/icons/ellipsis";
import Trash from "lucide-solid/icons/trash";

export default function TrashMenu() {
  const [data] = useData();
  return (
    <Menu.Root>
      <span class="relative group">
        <A class="flex items-center justify-between btn px-2" href="/trash" activeClass="bg-blue-700">
          <span class="flex items-center gap-2">
            <Trash class="size-4" />
            Trash
          </span>
        </A>
        <Menu.Trigger title="Settings Folder" class="hidden group-hover:block data-[state=open]:block absolute top-1/2 right-0 -translate-y-1/2 z-10 data-[state=open]:bg-blue-700 btn mr-1">
          <Ellipsis class="size-4" />
        </Menu.Trigger>
        <span class="group-hover:hidden absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center mr-1 size-6 text-xs">{data.trash.length}</span>
      </span>
      <Menu.Positioner>
        <Menu.Content class="z-10 flex flex-col gap-1 p-2 rounded-lg bg-layout-tertiary">
          <button title="Clean Up Trash" class="w-full flex items-center gap-2 btn text-red-400">
            <Trash class="size-4" />
            Clean Up
          </button>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
