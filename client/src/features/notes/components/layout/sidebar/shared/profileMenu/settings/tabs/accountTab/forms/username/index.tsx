import { createForm, custom, pattern, required } from "@modular-forms/solid";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import KeyRoundIcon from "lucide-solid/icons/key-round";
import CloseIcon from "lucide-solid/icons/x";
import Input from "@/shared/components/form/input";
import PasswordInput from "@/shared/components/form/password";
import useUserContext from "@/features/profile/hooks/useProfile";
import { Dialog } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { ParentProps } from "solid-js";
import UserRoundIcon from "lucide-solid/icons/user-round";
import { debounce } from "@/shared/utils/helpers";

type FormSchemaType = {
  username: string
  password: string
}

export default function ChangeUsername(props: ParentProps) {
  const [form, { Form, Field }] = createForm<FormSchemaType>({
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_, { checkUsername, changeUsername }] = useUserContext();

  async function handleUpdateUsername(schema: FormSchemaType) {
    await changeUsername(schema.username, schema.password);
  }

  const handleValidateUsername = debounce(checkUsername, 500) as () => Promise<boolean>;

  return (
    <Dialog.Root>
      {props.children}
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-sm flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
              <Form class="w-full flex flex-col justify-center gap-6" onSubmit={handleUpdateUsername}>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">Username</h4>
                    <p class="text-white/80">Modify your username.</p>
                  </div>
                  <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                    <CloseIcon />
                  </Dialog.CloseTrigger>
                </div>
                <Field
                  name="username"
                  validateOn="input"
                  validate={[
                    required("Username is required"),
                    pattern(/^[\w\d]{4,16}$/, "Username is alphanumeric with 4-16 characters"),
                    custom(handleValidateUsername, "Username is not available")
                  ]}
                >
                  {(field, props) => (
                    <Input {...props} type="text" placeholder="New Username" dirty={field.dirty} error={field.error} icon={<UserRoundIcon />} />
                  )}
                </Field>
                <Field
                  name="password"
                  validate={[
                    required("Password is required"),
                    pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password must be 8+ characters with uppercase, lowercase, numbers, and symbols")
                  ]}
                >
                  {(field, props) => (
                    <PasswordInput {...props} type="password" placeholder="Current Password" dirty={field.dirty} error={field.error} icon={<KeyRoundIcon />} />
                  )}
                </Field>
                <span class="w-full flex justify-center md:justify-end items-center gap-2">
                  <button class="w-full md:w-auto flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={form.submitting}>
                    <span class="group-disabled:hidden">
                      Update Username
                    </span>
                    <LoaderCircleIcon class="hidden group-disabled:block group-disabled:animate-spin text-center" />
                  </button>
                </span>
              </Form>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
