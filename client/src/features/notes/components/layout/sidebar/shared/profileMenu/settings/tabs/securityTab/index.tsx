import { createForm, zodForm } from "@modular-forms/solid";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import PasswordInput from "@/shared/components/form/password";
import KeyRoundIcon from "lucide-solid/icons/key-round";
import { A } from "@solidjs/router";
import useUserContext from "@/features/profile/hooks/useProfile";
import { z } from "zod";

const FormSchema = z.object({
  currentPassword: z.string({
    required_error: "Current password is required"
  }).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be 8+ characters with uppercase, lowercase, numbers, and symbols"),
  newPassword: z.string({
    required_error: "New password is required"
  }).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be 8+ characters with uppercase, lowercase, numbers, and symbols"),
  confirmPassword: z.string({
    required_error: "Confirm password is required"
  })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormSchemaType = z.infer<typeof FormSchema>

export default function SecurityTab() {
  const [form, { Form, Field }] = createForm<FormSchemaType>({
    validate: zodForm(FormSchema),
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_, { changePassword }] = useUserContext();

  async function handleUpdatePassword(schema: FormSchemaType) {
    await changePassword(schema.currentPassword, schema.newPassword)
  }

  return (
    <div>
      <Form class="w-full flex flex-col justify-center gap-6" onSubmit={handleUpdatePassword}>
        <div>
          <h4>Password</h4>
          <p class="text-white/80">Update your password</p>
        </div>
        <Field
          name="currentPassword"
        >
          {(field, props) => (
            <PasswordInput {...props} type="text" placeholder="Current Password" dirty={field.dirty} error={field.error} icon={<KeyRoundIcon />} />
          )}
        </Field>
        <Field
          name="newPassword"
        >
          {(field, props) => (
            <PasswordInput {...props} type="text" placeholder="New Password" dirty={field.dirty} error={field.error} icon={<KeyRoundIcon />} />
          )}
        </Field>
        <Field
          name="confirmPassword"
        >
          {(field, props) => (
            <PasswordInput {...props} type="text" placeholder="Confirm Password" dirty={field.dirty} error={field.error} icon={<KeyRoundIcon />} />
          )}
        </Field>
        {/* <button class="btn btn-primary self-end">Enable Two-Factor Authentication</button> */}
        <span class="w-full flex flex-col-reverse md:flex-row justify-between items-center gap-2">
          <A class="w-full md:w-auto text-center underline underline-offset-2" href="auth/forgot-password">Forgot Password</A>
          <button class="w-full md:w-auto flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={form.submitting}>
            <span class="group-disabled:hidden">
              Update Password
            </span>
            <LoaderCircleIcon class="hidden group-disabled:block group-disabled:animate-spin text-center" />
          </button>
        </span>
      </Form>
    </div>
  )
}
