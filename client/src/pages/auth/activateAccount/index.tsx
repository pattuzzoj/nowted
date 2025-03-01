import { useSearchParams } from "@solidjs/router";
import { useAuth } from "@context/auth";
import LoaderCircle from "lucide-solid/icons/loader-circle";


export default function activateAccount() {
  const {handleActivateAccount} = useAuth();
  const [params, _setParams] = useSearchParams<{ token: string }>();
  handleActivateAccount(params.token!);

  return (
    <LoaderCircle class="text-center animate-spin size-8" />
  );
}