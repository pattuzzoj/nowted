import { onMount, ParentProps, Show } from "solid-js";
import useAuth from "../../hooks/useAuth";

export default function PrivateRoute(props: ParentProps) {
  const { isAuthenticated, handleVerifySession } = useAuth();

  onMount(async () => {
    // await handleVerifySession();
  });

  return (
    <Show when={isAuthenticated() || true}>
      {props.children}
    </Show>
  )
}
