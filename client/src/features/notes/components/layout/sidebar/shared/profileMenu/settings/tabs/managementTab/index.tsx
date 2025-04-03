import useProfileContext from "@/features/profile/hooks/useProfile";

export default function ManagementTab() {
  const [_profile, {deleteData, deleteAccount}] = useProfileContext();

  return (
    <div class="w-full flex flex-col justify-center gap-6">
      <div>
        <h4>Management</h4>
        <p class="text-white/80">Manage your account status and data</p>
      </div>
      <div class="flex flex-col justify-center gap-4">
        <div class="flex flex-col gap-4 border-1 p-4 rounded-lg border-white/20">
          <h6>Delete All Data</h6>
          <p>Delete all your data while keeping your account active. This will remove all your folders and notes.</p>
          <button class="self-start btn btn-background-danger" onClick={deleteData}>Delete All Data</button>
        </div>
        <div class="flex flex-col gap-4 border-1 p-4 rounded-lg border-white/20 text-black bg-red-300">
          <h6>Delete Account</h6>
          <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button class="self-start btn btn-background-danger text-white" onClick={deleteAccount}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}
