import { ParentProps } from "solid-js";
import Action from "../action";
import useAuth from "@/features/auth/hooks/useAuth";

interface LogoutActionProps extends ParentProps {
  class?: string;
}

export default function LogoutAction(props: LogoutActionProps) {
  const { handleLogout } = useAuth();

  return (
    <Action title="Logout" class={props.class} onClick={async () => await handleLogout()}>
      {props.children}
    </Action>
  )
}
