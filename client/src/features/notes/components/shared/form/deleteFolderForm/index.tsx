import { Show } from "solid-js";
import { createForm } from "@modular-forms/solid";
import FolderIcon from "lucide-solid/icons/folder";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import useData from "@/features/notes/hooks/useData";
import Input from "@/shared/components/form/input";
import type { Folder } from "@/features/notes/types";

type Schema = {
  name: string
}

interface DeleteFolderFormProps {
  folder: Folder
}

export default function DeleteFolderForm(props: DeleteFolderFormProps) {
  const [form, { Form, Field }] = createForm<Schema>({
    initialValues: {
      name: props.folder.name
    },
  });
  const [_data, { deleteFolder }] = useData();
  0
  async function deleteFolderSubmit() {
    await deleteFolder(props.folder.id);
  }

  return (
    <Form class="w-full flex flex-col justify-center gap-6" onSubmit={deleteFolderSubmit}>
      <Field
        name="name"
      >
        {(field, fieldProps) => (
          <Input {...fieldProps} type="text" placeholder="name" value={field.value} dirty={field.dirty} error={field.error} icon={<FolderIcon />} disabled />
        )}
      </Field>
      <button title="delete folder" class="flex justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm-danger" type="submit" disabled={form.submitting}>
        <Show when={form.submitting} fallback="Delete Folder">
          <LoaderCircle class="text-center group-disabled:animate-spin" />
        </Show>
      </button>
    </Form>
  )
}
