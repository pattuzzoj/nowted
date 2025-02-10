import { Show } from "solid-js";
import { createForm, pattern, required } from "@modular-forms/solid";
import Folder from "lucide-solid/icons/folder";
import LoaderCircle from "lucide-solid/icons/loader-circle";
import Error from "@components/form/error/error";
import { useData } from "@context/data";
import InputIcon from "../inputIcon";

type Schema = {
  name: string
}

interface DeleteFolderForm {
  id: string;
  name: string;
}

export default function DeleteFolderForm(props: DeleteFolderForm) {
  const [form, { Form, Field }] = createForm<Schema>({
    initialValues: {
      name: props.name
    },
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_data, {folderService}] = useData();

  async function deleteFolderSubmit(schema: Schema) {
    const name = schema.name;
    await folderService.deleteFolder(props.id);
  }

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={deleteFolderSubmit}>
      <Field
      name="name"
      validate={[
        required("Name is required"),
        pattern(/^([\w\d]{4,16})$/, "Write a valid folder name")
      ]}
      >
        {(field, fieldProps) => (
          <InputIcon {...fieldProps} type="text" placeholder="name" value={props.name} icon={<Folder />} disabled>
            <Error error={field.error} />
          </InputIcon>
        )}
      </Field>
      <button title="delete folder" class="p-2 rounded-lg bg-red-500 cursor-pointer hover:bg-red-500/70 flex justify-center active:bg-accent disabled:opacity-50 group" type="submit" disabled={form.submitting}>
        <Show when={form.submitting} fallback="Delete Folder">
          <LoaderCircle class="text-center group-disabled:animate-spin" />
        </Show>
      </button>
    </Form>
  )
}