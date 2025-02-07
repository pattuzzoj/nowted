import { Show } from "solid-js";

interface ErrorProps {
  error: string;
}

export default function Error(props: ErrorProps) {
  return (
    <Show when={props.error}>
      <span class="text-sm text-red-600">{props.error}</span>
    </Show>
  )
}