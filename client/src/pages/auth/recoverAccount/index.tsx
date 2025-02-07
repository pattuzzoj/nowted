import { createForm, pattern, required } from "@modular-forms/solid";
import Input from "components/form/input";
import Error from "components/form/error/error";
import { useAuth } from "context/auth";
import { createSignal, Show } from "solid-js";
import Submit from "components/form/submit";

type Recover = {
  account: string;
}

export default function RecoverAccount() {
  const [form, { Form, Field }] = createForm<Recover>();
  const [isEmailSent, setIsEmailSent] = createSignal(false);
  const [_, {handleRecoverAccount}] = useAuth();

  async function handleSubmitRecoverAccount(values: Recover) {
    const recoverAccountSent = await handleRecoverAccount(values.account);

    setIsEmailSent(recoverAccountSent);
  }

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={handleSubmitRecoverAccount}>
      <Field
      name="account"
      validate={[
        required("Account is required"),
        pattern(/^([\w\d]{4,16})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Account needed to be a username or email")
      ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="Account">
            <Show when={isEmailSent()}>
              <div class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-tertiary w-full text-center">
                <p>Check your email</p>
              </div>
            </Show>
            <Error error={field.error} />
          </Input>
        )}
      </Field>
      <Submit title="Recover Account" active={form.submitting} />
      <br />
      <span class="text-center">Already have an account? <a class="underline" href="/auth/sign-in">Login</a></span>
      <span class="text-center">Don't have an account? <a class="underline" href="/auth/sign-up">Register</a></span>
    </Form>
  )
}