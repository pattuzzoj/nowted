import useData from "@/features/notes/hooks/useData";
import { Avatar, Menu } from "@ark-ui/solid";
import UserRoundIcon from "lucide-solid/icons/user-round";
import Settings from "./settings";
import LogoutAction from "@/features/notes/components/shared/actions/logoutAction";
import LogOutIcon from "lucide-solid/icons/log-out";

export default function Profile() {
  const [data] = useData();

  return (
    <Menu.Root>
      <Menu.Trigger class="flex items-center gap-2 btn data-[state=open]:bg-primary">
        <Avatar.Root>
          <Avatar.Fallback>
            <UserRoundIcon class="size-4" />
          </Avatar.Fallback>
          <Avatar.Image class="rounded-full size-6" src={data?.user?.image} alt="avatar" />
        </Avatar.Root>
        Profile
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content class="w-30 z-10 flex flex-col gap-1 p-2 rounded-lg bg-layout-tertiary">
          <Settings />
          <LogoutAction>
            <LogOutIcon class="size-4" />
            Log out
          </LogoutAction>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
