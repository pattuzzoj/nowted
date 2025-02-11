import { createForm, pattern, required } from "@modular-forms/solid";
import Input from "@components/form/input";
import Password from "@components/form/password";
import Error from "@components/form/error/error";
import Submit from "@components/form/submit";
import { useAuth } from "@context/auth";

type Login = {
  login: string;
  password: string;
}

export default function SignIn() {
  const [form, { Form, Field }] = createForm<Login>({
    validateOn: "input",
    revalidateOn: "input"
  });
  const {handleSignIn} = useAuth();

  return (
    <Form class={`"w-full max-w-96 flex flex-col justify-center gap-6"`} onSubmit={handleSignIn}>
      <Field
      name="login"
      validate={[
        required("Login is required"),
        pattern(/^([\w\d]{4,16})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Login needed to be a username or email")
      ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="Login">
            <Error error={field.error} />
          </Input>
        )}
      </Field>
      <Field
      name="password"
      validate={[
        required("Password is required"),
        pattern(/^[^\s]{8,}$/, "Password needed at least 8 characters")
      ]}
      >
        {(field, props) => (
          <Password {...props} placeholder="Password">
            <Error error={field.error} />
          </Password>
        )}
      </Field>
      <Submit title="Login" active={form.submitting} />
      <br />
      <span class="text-center">Don't remember your password? <a class="underline" href="/auth/recover-account">Recover account</a></span>
      <span class="text-center">Don't have an account? <a class="underline" href="/auth/sign-up">Register</a></span>
    </Form>
  )
}