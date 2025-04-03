import FolderOpenIcon from "lucide-solid/icons/folder-open";

export default function Mian() {
  return (
    <div class="h-full flex-1 md:h-screen w-full bg-layout-secondary flex flex-col items-center justify-center text-center gap-4">
      <FolderOpenIcon class="size-12" />
      <h2>No folders selected</h2>
      <p class="max-w-96 text-white/50">Select a folder to view your notes. If you don't have any, create one to keep your notes organized.</p>
    </div>
  )
}
