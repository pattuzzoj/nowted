import { createForm, custom, email, pattern, required } from "@modular-forms/solid";
import KeyRound from "lucide-solid/icons/key-round";
import UserRound from "lucide-solid/icons/user-round";
import Mail from "lucide-solid/icons/mail";
import Input from "@/shared/components/form/input";
import Password from "@/shared/components/form/password";
import Submit from "@/shared/components/form/submit";
import useAuth from "../../hooks/useAuth";
import { debounce } from "@/shared/utils/helpers";

type Register = {
  email: string;
  username: string;
  password: string;
}

export default function Register() {
  const [form, { Form, Field }] = createForm<Register>();
  const { checkEmail, checkUsername, handleRegister } = useAuth();
  const handleValidateEmail = debounce(checkEmail, 500) as () => Promise<boolean>;
  const handleValidateUsername = debounce(checkUsername, 300) as () => Promise<boolean>;

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={handleRegister}>
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
          <Input {...props} type="email" placeholder="Email" dirty={field.dirty} error={field.error} icon={<Mail />} />
        )}
      </Field>
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
          <Input {...props} type="text" placeholder="Username" dirty={field.dirty} error={field.error} icon={<UserRound />} />
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
      <Submit title="Register" active={form.submitting} />
      <br />
      <span class="text-center">Already have an account? <a class="underline" href="/auth/login">Login</a></span>
    </Form>
  )
}
