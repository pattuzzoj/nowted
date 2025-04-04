import { createForm, custom, email, getValue, pattern, required } from "@modular-forms/solid";
import LoaderCircleIcon from "lucide-solid/icons/loader-circle";
import KeyRoundIcon from "lucide-solid/icons/key-round";
import CloseIcon from "lucide-solid/icons/x";
import Input from "@/shared/components/form/input";
import MailIcon from "lucide-solid/icons/mail";
import PasswordInput from "@/shared/components/form/password";
import useUserContext from "@/features/profile/hooks/useProfile";
import { Dialog, PinInput } from "@ark-ui/solid";
import { Portal } from "solid-js/web";
import { createSignal, ParentProps } from "solid-js";
import { debounce } from "@/features/notes/utils/functions";

type FormSchemaType = {
  email: string
  password: string
}

export default function ChangeEmail(props: ParentProps) {
  const [form, { Form, Field }] = createForm<FormSchemaType>({
    validateOn: "input",
    revalidateOn: "input"
  });
  const [_, { checkEmail, requestChangeEmail, confirmChangeEmail }] = useUserContext();
  const [verificationFormIsActive, setVerificationFormIsActive] = createSignal(false);
  const [sendConfirmationPin, setSendConfirmationPin] = createSignal(false);
  const [pin, setPin] = createSignal<string>("");

  async function handleUpdateEmail(schema: FormSchemaType) {
    await requestChangeEmail(schema.email, schema.password);
    setVerificationFormIsActive(true);
  }

  async function handleConfirmChangeEmail() {
    setSendConfirmationPin(true);
    await confirmChangeEmail(getValue(form, "email")!, pin());
    setSendConfirmationPin(false);
    setVerificationFormIsActive(false);
  }

  const handleValidateEmail = debounce(checkEmail, 500) as () => Promise<boolean>;

  return (
    <Dialog.Root>
      {props.children}
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-sm flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
              <Form class="w-full flex flex-col justify-center gap-6" onSubmit={handleUpdateEmail}>
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">Email</h4>
                    <p class="text-white/80">Modify your email.</p>
                  </div>
                  <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                    <CloseIcon />
                  </Dialog.CloseTrigger>
                </div>
                <Field
                  name="email"
                  validateOn="input"
                  validate={[
                    required("Email is required"),
                    email("Email is invalid"),
                    custom(handleValidateEmail, "Email is not available")
                  ]}
                >
                  {(field, props) => (
                    <Input {...props} type="text" placeholder="New Email" dirty={field.dirty} error={field.error} icon={<MailIcon />} />
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
                <p class="text-white/80 text-sm">A PIN will be sent to your new address for confirmation</p>
                <span class="w-full flex justify-center md:justify-end items-center gap-2">
                  <button class="w-full md:w-auto flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={form.submitting}>
                    <span class="group-disabled:hidden">
                      Send Verification PIN
                    </span>
                    <LoaderCircleIcon class="hidden group-disabled:block group-disabled:animate-spin text-center" />
                  </button>
                </span>
                <Dialog.Root open={verificationFormIsActive()}>
                  <Portal>
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-md flex flex-col gap-6 p-4 rounded-lg bg-layout-primary border-2 border-white/10">
                          <div class="flex items-center justify-between">
                            <div>
                              <h4 class="font-medium">PIN</h4>
                              <p class="text-white/80">Enter the 4-digit verification code sent to {getValue(form, "email")}</p>
                            </div>
                            <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-close">
                              <CloseIcon />
                            </Dialog.CloseTrigger>
                          </div>
                          Verification Code
                          <PinInput.Root placeholder="O" onValueChange={(e) => setPin(e.valueAsString)}>
                            <PinInput.Control class="flex items-center gap-2">
                              <PinInput.Input class="w-full text-center btn border-1 border-white/20 size-14 text-lg" index={0} />
                              <PinInput.Input class="w-full text-center btn border-1 border-white/20 size-14 text-lg" index={1} />
                              <PinInput.Input class="w-full text-center btn border-1 border-white/20 size-14 text-lg" index={2} />
                              <PinInput.Input class="w-full text-center btn border-1 border-white/20 size-14 text-lg" index={3} />
                            </PinInput.Control>
                          </PinInput.Root>
                          <div class="flex justify-end gap-2">
                            <Dialog.CloseTrigger title="close form" class="dialog-btn dialog-btn-cancel px-4">
                              Cancel
                            </Dialog.CloseTrigger>
                            <form onSubmit={handleConfirmChangeEmail}>
                              <span class="flex justify-center md:justify-end items-center gap-2">
                                <button class="w-full md:w-auto flex items-center justify-center disabled:opacity-50 group dialog-btn dialog-btn-confirm" type="submit" disabled={pin()?.length !== 4 && sendConfirmationPin()}>
                                  <span class="group-disabled:hidden">
                                    Confirm Change Email
                                  </span>
                                  <LoaderCircleIcon class="hidden group-disabled:block group-disabled:animate-spin text-center" />
                                </button>
                              </span>
                            </form>
                          </div>
                        </div>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root >
              </Form>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
