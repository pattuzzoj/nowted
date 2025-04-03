import { createForm, maxLength, required } from "@modular-forms/solid";
import useData from "@/features/notes/hooks/useData";
import FileIcon from "lucide-solid/icons/file";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import Input from "@/shared/components/form/input";

type Schema = {
  name?: string;
}

export default function CreateNoteForm() {
  const [form, { Form, Field }] = createForm<Schema>({
    initialValues: {
      name: ""
    },
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_data, { createNote }] = useData();

  async function handleCreateNote(schema: Schema) {
    await createNote(schema);
  }

  return (
    <Form class="w-full flex flex-col justify-center gap-6" onSubmit={handleCreateNote}>
      <Field
        name="name"
        validate={[
          required("Name is required"),
          maxLength(48, "Note name must be a maximum of 48 characters")
        ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="name" dirty={field.dirty} error={field.error} icon={<FileIcon />} />
        )}
      </Field>
      <button class="w-full flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={form.submitting}>
        <span class="group-disabled:hidden">
          Create Note
        </span>
        <LoaderCircleIcon class="hidden group-disabled:block group-disabled:animate-spin text-center" />
      </button>
    </Form>
  )
}
