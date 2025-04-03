import useData from "@/features/notes/hooks/useData";
import { createForm } from "@modular-forms/solid";
import Submit from "@/shared/components/form/submit";

interface RestoreNoteFormProps {
  noteId: string;
  folderId: string;
}

export default function RestoreNoteForm(props: RestoreNoteFormProps) {
  const [form, { Form }] = createForm();
  const [_data, { restoreNote }] = useData();

  async function handleRestoreNote() {
    await restoreNote(props.noteId, props.folderId);
  }

  return (
    <Form class="w-full flex flex-col justify-center gap-6" onSubmit={handleRestoreNote}>
      <Submit title="Restore Note" active={Boolean(props.folderId) && form.submitting} />
    </Form>
  );
}
