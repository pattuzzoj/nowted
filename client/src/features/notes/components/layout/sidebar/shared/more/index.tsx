import { A } from "@solidjs/router";
import ArchiveIcon from "lucide-solid/icons/archive";
import StarIcon from "lucide-solid/icons/star";
import useData from "@/features/notes/hooks/useData";
import TrashMenu from "./trash";

export default function More() {
  const [data] = useData();

  return (
    <div class="flex flex-col gap-1">
      <h2 id="more" class="text-sm">More</h2>
      <nav aria-labelledby="more" class="flex flex-col gap-1">
        <span class="relative group">
          <A class="flex items-center gap-2 group-hover:bg-hover btn px-2" href="/favorites" activeClass="bg-blue-700">
            <StarIcon class="size-4" />
            Favorites
          </A>
          <span class="absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center mr-1 size-6 text-xs">{data.favorites.length}</span>
        </span>
        <span class="relative group">
          <A class="flex items-center gap-2 group-hover:bg-hover btn px-2" href="/archived" activeClass="bg-blue-700">
            <ArchiveIcon class="size-4" />
            Archived
          </A>
          <span class="absolute top-1/2 right-0 -translate-y-1/2 flex justify-center items-center  mr-1 size-6 text-xs">{data.archived.length}</span>
        </span>
        <TrashMenu />
      </nav>
    </div>
  )
}
