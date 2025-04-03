import StarIcon from "lucide-solid/icons/star";

export default function EmptyFavorites() {
  return (
    <div class="h-screen w-full bg-layout-secondary flex flex-col items-center justify-center text-center gap-4">
      <StarIcon class="size-12" />
      <h2>No favorite notes</h2>
      <p class="max-w-96 text-white/50">You haven't added any notes to favorites yet. Mark important notes for quick access.</p>
    </div>
  );
}
