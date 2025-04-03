import { onMount, ParentProps, Show } from "solid-js";
import useAuth from "../../hooks/useAuth";

export default function PrivateRoute(props: ParentProps) {
  const { isAuthenticated, handleVerify } = useAuth();

  onMount(async () => {
    // await handleVerify();
  });

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  )
}
