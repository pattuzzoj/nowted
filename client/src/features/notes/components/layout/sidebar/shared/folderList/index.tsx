import { For } from "solid-js";
import useData from "@/features/notes/hooks/useData";
import CreateFolderDialog from "@/features/notes/components/shared/dialog/createFolderDialog";
import FolderItem from "./folderItem";

export default function FolderList() {
  const [data] = useData();
  return (
    <div class="flex flex-col gap-1">
      <div class="flex justify-between items-center">
        <h2 id="folders" class="text-sm">Folders</h2>
        <CreateFolderDialog />
      </div>
      <nav aria-labelledby="folders" class="flex flex-col gap-1">
        <For each={data.folders}>
          {(folder) => <FolderItem {...folder} />}
        </For>
      </nav>
    </div>
  );
}
