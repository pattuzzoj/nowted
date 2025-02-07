import { createForm, pattern, required } from "@modular-forms/solid";
import Error from "components/form/error/error";
import Submit from "components/form/submit";
import Folder from "lucide-solid/icons/folder";
import { useData } from "context/data";
import InputIcon from "../inputIcon";
import { Folder as IFolder } from "types/interfaces";

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
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-red-800 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#991b1b" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-red-600 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#dc2626" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-red-400 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#f87171" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-red-200 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#fecaca" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-red-100 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#fee2e2" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-purple-800 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#6b21a8" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-purple-600 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#9333ea" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-purple-400 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#c084fc" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-purple-200 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#e9d5ff" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-purple-100 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#f3e8ff" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-blue-800 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#1e40af" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-blue-600 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#2563eb" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-blue-400 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#60a5fa" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-blue-200 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#bfdbfe" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-blue-100 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#dbeafe" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-green-800 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#166534" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-green-600 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#16a34a" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-green-400 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#4ade80" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-green-200 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#bbf7d0" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-green-100 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#dcfce7" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-yellow-800 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#854d0e" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-yellow-600 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#ca8a04" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-yellow-400 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#facc15" checked/>
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-yellow-200 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#fef08a" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
        <Field name="color">
          {(_field, props) => (
            <label class="flex items-center justify-center size-10 rounded-full bg-yellow-100 cursor-pointer">
              <input {...props} class="border-0 hidden peer" type="radio" value="#fef9c3" />
              <span class="inline size-5 rounded-full bg-transparent peer-checked:bg-white"></span>
            </label>
          )}
        </Field>
      </div>
      <Submit title={props.id ? "Update Folder" : "Create Folder"} active={form.submitting} />
    </Form>
  )
}