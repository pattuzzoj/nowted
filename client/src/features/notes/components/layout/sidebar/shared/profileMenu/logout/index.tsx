import LogoutAction from "@/features/notes/components/shared/actions/logoutAction";
import LogOutIcon from "lucide-solid/icons/log-out";

export default function Logout() {
  return (
    <LogoutAction>
      <LogOutIcon class="size-4" />
      Log out
    </LogoutAction>
  )
}
