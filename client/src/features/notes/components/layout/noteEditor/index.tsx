import useData from "@/features/notes/hooks/useData"
import { formatDate } from "@utilify/core";
import CalendarDaysIcon from "lucide-solid/icons/calendar-days";
import CircleEllipsisIcon from "lucide-solid/icons/circle-ellipsis";
import FolderIcon from "lucide-solid/icons/folder";
import Editor from "./editor";
import { A } from "@solidjs/router";
import NoteMenu from "@/features/notes/components/shared/menu/noteMenu";
import { Menu } from "@ark-ui/solid";
import PencilLineIcon from "lucide-solid/icons/pencil-line";

export default function NoteEditor() {
  const [data, { updateNote }] = useData();

  return (
    <section class="h-screen max-md:w-screen flex flex-col gap-4 py-2 px-4">
      <header class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <PencilLineIcon class="size-5" />
          <h3 class="flex items-center gap-2" contentEditable onBlur={(e) => updateNote({ ...data.note, name: e.target.textContent as string })}>
            {data.note.name}
          </h3>
        </div>
        <NoteMenu note={data.note}>
          <Menu.Trigger class="btn data-[state=open]:bg-primary">
            <CircleEllipsisIcon />
          </Menu.Trigger>
        </NoteMenu>
      </header>
      <hr class="border-white/20" />
      <span class="flex gap-4">
        <span class="flex items-center gap-2">
          <CalendarDaysIcon class="size-5" />
          Date
        </span>
        {formatDate(new Date(data.note.created_at), "DMY")}
      </span>
      <hr class="border-white/20" />
      <span class="flex gap-4">
        <span class="flex items-center gap-2">
          <FolderIcon class="size-5" />
          Folder
        </span>
        <A class="underline underline-offset-4" href={`/folder/${data.note.folder_id}`}>{data.folder.name}</A>
      </span>
      <hr class="border-white/20" />
      <Editor />
    </section>
  )
}
