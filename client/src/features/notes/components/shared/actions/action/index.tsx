import { createSignal, ParentProps } from "solid-js";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";

interface ActionProps extends ParentProps {
  title: string;
  class?: string;
  onClick: () => Promise<void>;
 }

export default function Action(props: ActionProps) {
  const [isLoading, setIsLoading] = createSignal(false);

  const handleAction = async () => {
    setIsLoading(true);
    await props.onClick();
    setIsLoading(false);
  };

  return (
    <button title={props.title} class="relative" onClick={handleAction} disabled={isLoading()}>
      <span data-loading={isLoading()} class={`data-[loading=true]:text-transparent! flex items-center gap-2 btn ${props.class}`}>{props.children}</span>
      <span data-loading={isLoading()} class="hidden data-[loading=true]:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
        <LoaderCircleIcon class="size-4 animate-spin" />
      </span>
    </button>
  );
}
