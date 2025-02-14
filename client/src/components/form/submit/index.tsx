import { JSX, Show, splitProps } from "solid-js";
import LoaderCircle from "lucide-solid/icons/loader-circle";

interface SubmitProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  title: string;
  active: boolean;
}

export default function Submit(props: SubmitProps) {
  const [local, attrs] = splitProps(props, ["active"]);

  return (
    <button {...attrs} class="p-2 rounded-lg bg-violet-500 cursor-pointer hover:bg-accent/70 flex justify-center active:bg-accent disabled:opacity-50 group" type="submit" disabled={local.active}>
      <Show when={local.active} fallback={attrs.title}>
        <LoaderCircle class="text-center group-disabled:animate-spin" />
      </Show>
    </button>
  )
}