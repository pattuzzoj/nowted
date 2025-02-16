import { Accessor, Setter, createContext, createSignal, ParentProps, useContext, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import AuthService from "@services/auth";
import type { SignIn, SignUp } from "@services/auth/interfaces";
import useToast from "@hooks/useToast";
import { useIndexedDB } from "../indexedDB";
import FetchService from "@/services/fetch";
import { baseURL } from "@/utils/constants";
import { messages } from "@/utils/messages/index";
import FetchResponse from "@/services/fetch/interface/fetchResponse.interface";

const AuthContext = createContext<Auth>();

interface Auth {
  isAuthenticated: Accessor<boolean>,
  setIsAuthenticated: Setter<boolean>,
  authStatus: () =>  Promise<FetchResponse<unknown>>,
  handleSignIn: (credentials: SignIn) => Promise<void>,
  handleSignUp: (registration: SignUp) => Promise<void>,
  handleLogOut: () => Promise<void>,
  handleRecoverAccount: (account: string) => Promise<void>,
  handleResetPassword: (token: string, password: string) => Promise<void>
}

export default function AuthProvider(props: ParentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(true);
  const fetchService = new FetchService(baseURL.concat("/auth"));
  const authService = AuthService.getInstance(fetchService);
  const [_, { clearDatabase }] = useIndexedDB();
  const navigate = useNavigate();
  const notify = useToast();

  async function handleSignIn(credentials: SignIn) {
    await notify.promise(
      async () => {
        const { status, message } = await authService.signIn(credentials);

        if (status === "error") {
          throw new Error(message);
        }

        setIsAuthenticated(true);
        navigate("/");
        return message;
      },
      messages.LOGIN
    );
  }

  async function handleSignUp(registration: SignUp) {
    await notify.promise(
      async () => {
        const { status, message } = await authService.signUp(registration);

        if (status === "error") {
          throw new Error(message);
        }

        navigate("/auth/sign-in");
        return message;
      },
      messages.REGISTER
    );
  }

  async function handleLogOut() {
    await notify.promise(
      async () => {
        const { status, message } = await authService.logOut();

        if (status === "error") {
          throw new Error(message);
        }

        localStorage.clear();
        await clearDatabase();
        setIsAuthenticated(false);
        navigate("/auth/sign-in");
        return message;
      },
      messages.LOGOUT
    );
  }

  async function handleRecoverAccount(account: string) {
    await notify.promise<boolean>(
      async () => {
        const { status, message } = await authService.recoverAccount(account);

        if (status === "error") {
          throw new Error(message);
        }

        return true;
      },
      messages.ACCOUNT_RECOVERY
    );
  }

  async function handleResetPassword(token: string, password: string) {
    await notify.promise(
      async () => {
        const { status, message } = await authService.resetPassword(token, password);

        if (status === "error") {
          navigate("/auth/recover-account");
          throw new Error(message);
        }

        navigate("/auth/sign-in");
        return message;
      },
      messages.RESET_PASSWORD
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authStatus: authService.status, handleSignIn, handleSignUp, handleLogOut, handleRecoverAccount, handleResetPassword }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): Auth => useContext(AuthContext) as unknown as Auth;

export function AuthRoute(props: ParentProps) {
  const { isAuthenticated, setIsAuthenticated, authStatus } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();

  (async () => {
    const { status, message } = await authStatus();

    if (status === "error") {
      notify.error(message);
      navigate("/auth/sign-in");
      return;
    }

    notify.success(message);
    setIsAuthenticated(true);
  })();

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
}