import { Dialog } from "@ark-ui/solid";
import { createSignal, Match, ParentProps, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import CloseIcon from "lucide-solid/icons/x";
import ChangeEmailForm from "../../form/changeEmailForm";
import ChangePasswordForm from "../../form/changePasswordForm";

export default function ProfileSettingsDialog(props: ParentProps) {
  const [activeTab, setActiveTab] = createSignal("profile");

  return (
    <Dialog.Root>
      {props.children}
      <Portal>
        <Dialog.Content>
          <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-96 flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Settings</h4>
              <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                <CloseIcon />
              </Dialog.CloseTrigger>
            </div>
            <div class="flex flex-col gap-4">
              <ul class="w-full flex justify-between items-center gap-2 p-2 rounded-xl bg-secondary">
                <li class="w-1/3">
                  <button data-active={activeTab() === "profile"} class="w-full btn data-[active=true]:bg-primary" onClick={() => setActiveTab("profile")}>Profile</button>
                </li>
                <li class="w-1/3">
                  <button data-active={activeTab() === "email"} class="w-full btn data-[active=true]:bg-primary" onClick={() => setActiveTab("email")}>Email</button>
                </li>
                <li class="w-1/3">
                  <button data-active={activeTab() === "password"} class="w-full btn data-[active=true]:bg-primary" onClick={() => setActiveTab("password")}>Password</button>
                </li>
              </ul>
              <Switch>
                <Match when={activeTab() === "profile"}>
                  Profile
                </Match>
                <Match when={activeTab() === "email"}>
                  <ChangeEmailForm />
                </Match>
                <Match when={activeTab() === "password"}>
                  <ChangePasswordForm />
                </Match>
              </Switch>
            </div>
            {/* <Tabs.Root activationMode="manual" defaultValue="profile" onValueChange={({ value }) => setActiveTab(value)} class="w-full flex flex-col gap-2">
              <Tabs.List class="w-full flex justify-between gap-2 btn bg-secondary">
                <Tabs.Trigger value="profile" data-active={activeTab() === "profile"} class="w-full btn data-[active=true]:bg-primary">
                  Profile
                </Tabs.Trigger>
                <Tabs.Trigger value="email" data-active={activeTab() === "email"} class="w-full btn data-[active=true]:bg-primary">
                  Email
                </Tabs.Trigger>
                <Tabs.Trigger value="password" data-active={activeTab() === "password"} class="w-full btn data-[active=true]:bg-primary">
                  Password
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="profile">
                Profile
              </Tabs.Content>
              <Tabs.Content value="email">
                <ChangeEmailForm />
              </Tabs.Content>
              <Tabs.Content value="password">
                <ChangePasswordForm />
              </Tabs.Content>
            </Tabs.Root> */}
          </div>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );
}
