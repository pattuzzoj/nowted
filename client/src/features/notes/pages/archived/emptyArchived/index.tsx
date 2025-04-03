import ArchiveIcon from "lucide-solid/icons/archive";

export default function EmptyArchived() {
  return (
    <div class="h-screen w-full bg-layout-secondary flex flex-col items-center justify-center text-center gap-4">
      <ArchiveIcon class="size-12" />
      <h2>No archived notes</h2>
      <p class="max-w-96 text-white/50">There are no archived notes. Archive notes to hide them without deleting permanently.</p>
    </div>
  );
}
