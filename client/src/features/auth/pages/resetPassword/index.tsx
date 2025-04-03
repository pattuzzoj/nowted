import { useNavigate, useSearchParams } from "@solidjs/router";
import { createForm, pattern, required } from "@modular-forms/solid";
import KeyRound from "lucide-solid/icons/key-round";
import Password from "@/shared/components/form/password";
import Submit from "@/shared/components/form/submit";
import useAuth from "../../hooks/useAuth";

type Password = {
  password: string;
}

export default function ResetPassword() {
  const [params, _setParams] = useSearchParams<{ token: string }>();
  const navigate = useNavigate();
  const token = params.token;
  
  if (!token) {
    navigate("/auth/recover-account");
  }

  const {handleResetPassword} = useAuth();


  const [form, { Form, Field }] = createForm<Password>();

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={(values) => handleResetPassword(token!, values.password)}>
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
      <Submit title="Change Password" active={form.submitting} />
      <br />
      <span class="text-center">Already have an account? <a class="underline" href="/auth/login">Login</a></span>
      <span class="text-center">Don't have an account? <a class="underline" href="/auth/register">Register</a></span>
    </Form>
  )
}
