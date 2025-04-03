import { createForm, maxLength, required } from "@modular-forms/solid";
import FolderIcon from "lucide-solid/icons/folder";
import useData from "@/features/notes/hooks/useData";
import { For } from "solid-js";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import Input from "@/shared/components/form/input";

type Schema = {
  name?: string;
  color?: string;
}

export default function CreateFolderForm() {
  const [form, { Form, Field }] = createForm<Schema>({
    initialValues: {
      name: "",
      color: "#facc15"
    },
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_data, { createFolder }] = useData();

  async function handleCreateFolder(schema: Schema) {
    await createFolder(schema);
  }

  const colors = [
    '#991b1b', '#dc2626', '#f87171', '#fecaca', '#fee2e2', // red
    '#6b21a8', '#9333ea', '#c084fc', '#e9d5ff', '#f3e8ff', // purple
    '#1e40af', '#2563eb', '#60a5fa', '#bfdbfe', '#dbeafe', // blue
    '#166534', '#16a34a', '#4ade80', '#bbf7d0', '#dcfce7', // green
    '#854d0e', '#ca8a04', '#facc15', '#fef08a', '#fef9c3', // yellow
  ];

  return (
    <Form class="w-full flex flex-col justify-center gap-6" onSubmit={handleCreateFolder}>
      <Field
        name="name"
        validate={[
          required("Name is required"),
          maxLength(24, "Folder name must be a maximum of 24 characters")
        ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="name" dirty={field.dirty} error={field.error} icon={<FolderIcon />} />
        )}
      </Field>
      <h5>Color</h5>
      <div class="grid grid-cols-5 gap-3">
        <For each={colors}>
          {(color) => (
            <Field name="color">
              {(_field, props) => (
                <label class={`flex items-center justify-center size-10 rounded-full cursor-pointer`} style={{ "background-color": color }}>
                  <input {...props} class="border-0 hidden peer" type="radio" value={color} />
                  <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
                </label>
              )}
            </Field>
          )}
        </For>
      </div>
      <button class="w-full flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={form.submitting}>
        <span class="group-disabled:hidden">
          Create Folder
        </span>
        <LoaderCircleIcon class="hidden group-disabled:block group-disabled:animate-spin text-center" />
      </button>
    </Form>
  )
}
