import { createForm, email, pattern, required } from "@modular-forms/solid";
import Input from "@components/form/input";
import Password from "@components/form/password";
import Error from "@components/form/error/error";
import Submit from "@components/form/submit";
import { useAuth } from "@context/auth";

type Register = {
  email: string;
  username: string;
  password: string;
}

export default function Register() {
  const [form, { Form, Field }] = createForm<Register>();
  const {handleRegister} = useAuth();

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={handleRegister}>
      <Field
      name="email"
      validate={[
        required("Email is required"),
        email("Email is invalid")
      ]}
      >
        {(field, props) => (
          <Input {...props} type="email" placeholder="Email">
            <Error error={field.error} />
          </Input>
        )}
      </Field>
      <Field
      name="username"
      validate={[
        required("Username is required"),
        pattern(/^[\w\d]{4,16}$/, "Username is alphanumeric with 4-16 characters")
      ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="Username">
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
      <Submit title="Register" active={form.submitting} />
      <br />
      <span class="text-center">Already have an account? <a class="underline" href="/auth/sign-in">Login</a></span>
    </Form>
  )
}