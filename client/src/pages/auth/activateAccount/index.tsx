import { useSearchParams } from "@solidjs/router";
import { useAuth } from "@context/auth";


export default function activateAccount() {
  const {handleActivateAccount} = useAuth();
  const [params, _setParams] = useSearchParams<{ token: string }>();
  handleActivateAccount(params.token!);

  return (
    <></>
  );
}