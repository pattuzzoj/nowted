import { JSX, Show, splitProps } from "solid-js";
import LoaderCircle from "lucide-solid/icons/loader-circle";

interface SubmitProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  title: string;
  active: boolean;
}

export default function Submit(props: SubmitProps) {
  const [local, attrs] = splitProps(props, ["active"]);

  return (
    <button {...attrs} class="cursor-pointer flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={local.active}>
      <Show when={local.active} fallback={attrs.title}>
        <LoaderCircle class="text-center group-disabled:animate-spin" />
      </Show>
    </button>
  )
}