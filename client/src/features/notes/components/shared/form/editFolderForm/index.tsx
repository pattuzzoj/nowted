import { For } from "solid-js";
import { createForm, maxLength, required } from "@modular-forms/solid";
import FolderIcon from "lucide-solid/icons/folder";
import Submit from "@/shared/components/form/submit";
import useData from "@/features/notes/hooks/useData";
import Input from "@/shared/components/form/input";
import type { Folder } from "@/features/notes/types";

type Schema = {
  name?: string;
  color?: string;
}

interface EditFolderFormProps {
  folder: Folder;
}

export default function EditFolderForm(props: EditFolderFormProps) {
  const [form, { Form, Field }] = createForm<Schema>({
    initialValues: {
      name: props.folder.name,
      color: props.folder.color
    },
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_data, { updateFolder }] = useData();

  async function updateFolderSubmit(schema: Schema) {
    await updateFolder({ ...props.folder, ...schema });
  }

  const colors = [
    '#991b1b', '#dc2626', '#f87171', '#fecaca', '#fee2e2', // red
    '#6b21a8', '#9333ea', '#c084fc', '#e9d5ff', '#f3e8ff', // purple
    '#1e40af', '#2563eb', '#60a5fa', '#bfdbfe', '#dbeafe', // blue
    '#166534', '#16a34a', '#4ade80', '#bbf7d0', '#dcfce7', // green
    '#854d0e', '#ca8a04', '#facc15', '#fef08a', '#fef9c3', // yellow
  ];

  return (
    <Form class="w-full flex flex-col justify-center gap-6" onSubmit={updateFolderSubmit}>
      <Field
        name="name"
        validate={[
          required("Name is required"),
          maxLength(24, "Folder name must be a maximum of 24 characters")
        ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="name" value={field.value} dirty={field.dirty} error={field.error} icon={<FolderIcon />} />
        )}
      </Field>
      <h5>Color</h5>
      <div class="grid grid-cols-5 gap-3">
        <For each={colors}>
          {(color) => (
            <Field name="color">
              {(field, props) => (
                <label class={`flex items-center justify-center size-10 rounded-full cursor-pointer`} style={{ "background-color": color }}>
                  <input {...props} class="border-0 hidden peer" type="radio" checked={field.value === color} value={color} />
                  <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
                </label>
              )}
            </Field>
          )}
        </For>
      </div>
      <Submit title="Update Folder" active={form.submitting} />
    </Form>
  )
}
