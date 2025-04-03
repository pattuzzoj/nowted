import { Show } from "solid-js";
import { A } from "@solidjs/router";
import FolderOpenIcon from "lucide-solid/icons/folder-open";
import FolderIcon from "lucide-solid/icons/folder";
import useData from "@/features/notes/hooks/useData";
import FolderMenu from "@/features/notes/components/shared/menu/folderMenu";
import { Menu } from "@ark-ui/solid";
import EllipsisIcon from "lucide-solid/icons/ellipsis";
import type { Folder as FolderProps } from "@/features/notes/types";

export default function FolderItem(props: FolderProps) {
  const [data] = useData();

  return (
    <FolderMenu folder={props}>
      <Menu.ContextTrigger>
        <span class="block relative">
          <A title={props.name} class="w-full flex justify-start items-center gap-2 btn px-2" href={`/folder/${props.id}`} activeClass="bg-blue-700">
            <Show when={data.folder.id === props.id} fallback={<FolderIcon class="size-4 text-transparent" style={{ fill: props.color }} />}>
              <FolderOpenIcon class="size-4 text-transparent" style={{ fill: props.color }} />
            </Show>
            {props.name}
          </A>
          <Menu.Trigger title="Settings" class="absolute top-1/2 right-0 -translate-y-1/2 data-[state=open]:bg-blue-700 flex items-center btn mr-1">
            <EllipsisIcon class="size-4" />
          </Menu.Trigger>
        </span>
      </Menu.ContextTrigger>
    </FolderMenu>
  )
}
