import CreateNoteDialog from "@/features/notes/components/shared/dialog/createNoteDialog";
import { Dialog } from "@ark-ui/solid";
import FilePlusIcon from "lucide-solid/icons/file-plus";

export default function NewNote() {
  return (
    <CreateNoteDialog>
      <Dialog.Trigger title="Create Note" class="flex justify-center items-center gap-2 btn bg-layout-tertiary hover:bg-layout-tertiary/80 data-[state=open]:bg-blue-700">
        <FilePlusIcon class="size-5" />
        New Note
      </Dialog.Trigger>
    </CreateNoteDialog>
  )
}
