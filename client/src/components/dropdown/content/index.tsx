import { ParentProps, Show } from "solid-js";
import { useRoot } from "../root";

interface ContentProps extends ParentProps {}

export default function Content(props: ContentProps) {
  const [isActive] = useRoot();

  return (
    <Show when={isActive()}>
      {props.children}
    </Show>
  )
}