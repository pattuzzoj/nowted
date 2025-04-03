import useProfile from "@/features/profile/hooks/useProfile";
import ChangeEmail from "./forms/email";
import { Dialog } from "@ark-ui/solid";
import ChangeUsername from "./forms/username";

export default function AccountTab() {
  const [profile] = useProfile();

  return (
    <div class="w-full flex flex-col justify-center gap-6">
      <div>
        <h4>Profile</h4>
        <p class="text-white/80">Update your profile</p>
      </div>
      <div class="flex flex-col justify-center gap-6">
        <div class="flex justify-between items-center gap-4">
          <div class="flex flex-col">
            <h6>Username</h6>
            {profile.username || "John Doe"}
          </div>
          <ChangeUsername>
            <Dialog.Trigger class="btn btn-primary px-4">
              Edit
            </Dialog.Trigger>
          </ChangeUsername>
        </div>
        <div class="flex justify-between items-center gap-4">
          <div class="flex flex-col">
            <h6>Email</h6>
            {profile.email || "example@mail.com"}
          </div>
          <ChangeEmail>
            <Dialog.Trigger class="btn btn-primary px-4">
              Edit
            </Dialog.Trigger>
          </ChangeEmail>
        </div>
      </div>
    </div>
  )
}
