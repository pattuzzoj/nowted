import { JSX, Show, splitProps } from "solid-js";
import LoaderCircle from "lucide-solid/icons/loader-circle";

interface SubmitProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  title: string;
  active: boolean;
}

export default function Submit(props: SubmitProps) {
  const [local, attrs] = splitProps(props, ["active"]);

  return (
    <button {...attrs} class="p-2 rounded-lg bg-violet-600 cursor-pointer flex justify-center active:bg-violet-800 disabled:opacity-50 group" type="submit" disabled={local.active}>
      <Show when={local.active} fallback={attrs.title}>
        <LoaderCircle class="text-center group-disabled:animate-spin" />
      </Show>
    </button>
  )
}