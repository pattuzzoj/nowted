import { createForm, pattern, required } from "@modular-forms/solid";
import Folder from "lucide-solid/icons/folder";
import Error from "@components/form/error/error";
import Submit from "@components/form/submit";
import { useData } from "@context/data";
import { Folder as IFolder } from "@/types";
import InputIcon from "../inputIcon";
import { For } from "solid-js";

interface FolderProps extends Partial<IFolder> {}

type Schema = {
  name?: string;
  color?: string;
}

export default function UpdateFolderForm(props: FolderProps) {
  const [form, { Form, Field }] = createForm<Schema>({
    initialValues: {
      name: props.name || "",
      color: props.color || "#facc15"
    },
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_data, { folderService }] = useData();
  const colors = [
    "#991b1b",
    "#dc2626",
    "#f87171",
    "#fecaca",
    "#fee2e2",
    "#6b21a8",
    "#9333ea",
    "#c084fc",
    "#e9d5ff",
    "#f3e8ff",
    "#1e40af",
    "#2563eb",
    "#60a5fa",
    "#bfdbfe",
    "#dbeafe",
    "#166534",
    "#16a34a",
    "#4ade80",
    "#bbf7d0",
    "#dcfce7",
    "#854d0e",
    "#ca8a04",
    "#facc15",
    "#fef08a",
    "#fef9c3"
  ]

  async function updateFolderSubmit(schema: Schema) {
    if (props.id) {
      await folderService.updateFolder({...props, ...schema});
    } else {
      await folderService.createFolder(schema);
    }
  }

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={updateFolderSubmit}>
      <Field
        name="name"
        validate={[
          required("Name is required"),
          pattern(/^([\w\d]{3,16})$/, "Write a valid folder name")
        ]}
      >
        {(field, fieldProps) => (
          <InputIcon {...fieldProps} type="text" placeholder="name" value={props.name} icon={<Folder />}>
            <Error error={field.error} />
          </InputIcon>
        )}
      </Field>
      <h5>Color</h5>
      <div class="grid grid-cols-5 gap-3">
        <For each={colors}>
          {(color) => (
          <Field name="color">
            {(_field, props) => (
              <label class={`flex items-center justify-center size-10 rounded-full bg-[${color}] cursor-pointer`}>
                <input {...props} class="border-0 hidden peer" type="radio" value={color} />
                <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
              </label>
            )}
          </Field>
          )}
        </For>
      </div>
      <Submit title={props.id ? "Update Folder" : "Create Folder"} active={form.submitting} />
    </Form>
  )
}