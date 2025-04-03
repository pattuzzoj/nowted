import { Dialog } from "@ark-ui/solid";
import { createSignal, Match, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import CloseIcon from "lucide-solid/icons/x";
import SettingsIcon from "lucide-solid/icons/settings";
import UserRoundIcon from "lucide-solid/icons/user-round";
import LockIcon from "lucide-solid/icons/lock";
import UserRoundCogIcon from "lucide-solid/icons/user-round-cog";
import AccountTab from "./tabs/accountTab";
import SecurityTab from "./tabs/securityTab";
import ManagementTab from "./tabs/managementTab";

export default function Settings() {
  const [activeTab, setActiveTab] = createSignal("account");

  return (
    <Dialog.Root>
      <Dialog.Trigger class="flex items-center gap-2 btn">
        <SettingsIcon class="size-4" />
        Settings
      </Dialog.Trigger>
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-lg flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Settings</h4>
              <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-4">
              <ul class="w-full flex justify-between items-center gap-2 p-1.5 rounded-xl bg-secondary">
                <li class="w-1/3">
                  <button data-active={activeTab() === "account"} class="w-full flex justify-center items-center gap-2 btn data-[active=true]:bg-primary" onClick={() => setActiveTab("account")}>
                    <UserRoundIcon class="size-4" /> Account
                  </button>
                </li>
                <li class="w-1/3">
                  <button data-active={activeTab() === "security"} class="w-full flex justify-center items-center gap-2 btn data-[active=true]:bg-primary" onClick={() => setActiveTab("security")}>
                    <LockIcon class="size-4"/>
                    Security
                  </button>
                </li>
                <li class="w-1/3">
                  <button data-active={activeTab() === "management"} class="w-full flex justify-center items-center gap-2 btn data-[active=true]:bg-primary" onClick={() => setActiveTab("management")}>
                    <UserRoundCogIcon class="size-4" />
                    Management
                  </button>
                </li>
              </ul>
              <Switch>
                <Match when={activeTab() === "account"}>
                  <AccountTab />
                </Match>
                <Match when={activeTab() === "security"}>
                  <SecurityTab />
                </Match>
                <Match when={activeTab() === "management"}>
                  <ManagementTab />
                </Match>
              </Switch>
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
}
