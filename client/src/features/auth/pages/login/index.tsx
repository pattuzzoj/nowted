import { createForm, pattern, required } from "@modular-forms/solid";
import UserRound from "lucide-solid/icons/user-round";
import KeyRound from "lucide-solid/icons/key-round";
import Input from "@/shared/components/form/input";
import Password from "@/shared/components/form/password";
import Submit from "@/shared/components/form/submit";
import useAuth from "../../hooks/useAuth";

type Login = {
  login: string;
  password: string;
}

export default function Login() {
  const [form, { Form, Field }] = createForm<Login>({
    validateOn: "input",
    revalidateOn: "input"
  });
  const {handleLogin} = useAuth();

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={handleLogin}>
      <Field
      name="login"
      validate={[
        required("Login is required"),
        pattern(/^([\w\d]{4,16})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Login needed to be a username or email")
      ]}
      >
        {(field, props) => (
          <Input {...props} type="text" placeholder="Login" dirty={field.dirty} error={field.error} icon={<UserRound />} />
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
          <Password {...props} type="text" placeholder="Password" dirty={field.dirty} error={field.error} icon={<KeyRound />} />
        )}
      </Field>
      <Submit title="Login" active={form.submitting} />
      <br />
      <span class="text-center">Don't remember your password? <a class="underline" href="/auth/forgot-password">Forgot Password</a></span>
      <span class="text-center">Don't have an account? <a class="underline" href="/auth/register">Register</a></span>
    </Form>
  )
}
