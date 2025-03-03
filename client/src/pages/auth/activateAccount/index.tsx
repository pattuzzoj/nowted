import { useNavigate, useSearchParams } from "@solidjs/router";
import { useAuth } from "@context/auth";
import LoaderCircle from "lucide-solid/icons/loader-circle";

export default function activateAccount() {
  const [params, _setParams] = useSearchParams<{ token: string }>();
  const navigate = useNavigate();
  const token = params.token!;
  
  if (!token) {
    navigate("/auth/recover-account");
  }

  const {handleActivateAccount} = useAuth();

  handleActivateAccount(token);

  return (
    <LoaderCircle class="text-center animate-spin size-8" />
  );
}