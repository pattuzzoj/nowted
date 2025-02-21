import { useSearchParams } from "@solidjs/router";
import { useAuth } from "@context/auth";
import { onMount } from "solid-js";


export default function activateAccount() {
  const [params, _setParams] = useSearchParams<{ token: string }>();
  const {handleActivateAccount} = useAuth();
  const token = params.token;

  onMount(async () => handleActivateAccount(token));

  return (
    <div>
    </div>
  )
}