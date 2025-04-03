import { createEffect, createSignal } from "solid-js";
import { createForm, pattern, required } from "@modular-forms/solid";
import { createToaster, Toast, Toaster } from "@ark-ui/solid";
import UserRound from "lucide-solid/icons/user-round";
import Input from "@/shared/components/form/input";
import Submit from "@/shared/components/form/submit";
import useAuth from "../../hooks/useAuth";

type Recover = {
  account: string;
}

export default function RecoverAccount() {
  const [form, { Form, Field }] = createForm<Recover>();
  const [isEmailSent, setIsEmailSent] = createSignal(false);
  const { handleRecoverAccount } = useAuth();

  async function handleSubmitRecoverAccount(values: Recover) {
    const recoverAccountSent = await handleRecoverAccount(values.account);

    setIsEmailSent(recoverAccountSent);
  }

  const toaster = createToaster({
    placement: 'top-end',
    duration: 5000,
  })

  createEffect(() => {
    if (isEmailSent()) {
      toaster.create({
        title: "Recovery Email Sent",
        description: "Please check your inbox for the recovery email.",
        type: "success",
      })
    }
  })

  return (
    <>
      <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={handleSubmitRecoverAccount}>
        <Field
          name="account"
          validate={[
            required("Account is required"),
            pattern(/^([\w\d]{4,16})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Account needed to be a username or email")
          ]}
        >
          {(field, props) => (
            <Input {...props} type="text" placeholder="Account" dirty={field.dirty} error={field.error} icon={<UserRound />} />
          )}
        </Field>
        <Submit title="Recover Account" active={form.submitting} />
        <br />
        <span class="text-center">Already have an account? <a class="underline" href="/auth/login">Login</a></span>
        <span class="text-center">Don't have an account? <a class="underline" href="/auth/register">Register</a></span>
      </Form>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root class="w-96 flex flex-col gap-4 p-2 rounded-lg bg-layout-tertiary border-1 border-blue-700">
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
          </Toast.Root>
        )}
      </Toaster>
    </>
  )
}
