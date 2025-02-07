import { createForm, pattern, required } from "@modular-forms/solid";
import Password from "components/form/password";
import Error from "components/form/error/error";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { useAuth } from "context/auth";
import Submit from "components/form/submit";

type Password = {
  password: string;
}

export default function resetPassword() {
  const [params, _setParams] = useSearchParams<{ token: string }>();
  const {handleResetPassword} = useAuth();
  const navigate = useNavigate();
  const token = params.token;

  if (!token) {
    navigate("/auth/recover-account");
  }

  const [form, { Form, Field }] = createForm<Password>();

  return (
    <Form class="w-full max-w-96 flex flex-col justify-center gap-6" onSubmit={(values) => handleResetPassword(token!, values.password)}>
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
      <Submit title="Change Password" active={form.submitting} />
      <br />
      <span class="text-center">Already have an account? <a class="underline" href="/auth/sign-in">Login</a></span>
      <span class="text-center">Don't have an account? <a class="underline" href="/auth/sign-up">Register</a></span>
    </Form>
  )
}