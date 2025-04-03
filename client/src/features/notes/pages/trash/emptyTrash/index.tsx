import TrashIcon from "lucide-solid/icons/trash";

export default function EmptyTrash() {
  return (
    <div class="h-screen w-full bg-layout-secondary flex flex-col items-center justify-center text-center gap-4">
      <TrashIcon class="size-12" />
      <h2>Trash is empty</h2>
      <p class="max-w-96 text-white/50">No deleted notes found. Removed notes will appear here before permanent deletion.</p>
    </div>
  );
}
