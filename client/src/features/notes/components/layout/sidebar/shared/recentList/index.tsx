import useData from "@/features/notes/hooks/useData";
import { For, Show } from "solid-js";
import RecentItem from "./recentItem";

export default function RecentList() {
  const [data] = useData();

  return (
    <Show when={data.recents.length}>
      <div class="flex flex-col gap-1">
        <h2 id="recents" class="text-sm">Recents</h2>
        <nav aria-labelledby="recents" class="flex flex-col gap-1">
          <For each={data.recents}>
            {(note) => <RecentItem {...note} />}
          </For>
        </nav>
      </div>
    </Show>
  )
}
