import { Accessor, Setter, createContext, createSignal, ParentProps, useContext, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { sleep } from "@utilify/core";
import AuthService from "@services/auth";
import type { SignIn, SignUp } from "@services/auth/interfaces";
import useToast from "@hooks/useToast";
import { useIndexedDB } from "../indexedDB";
import FetchService from "@/services/fetch";
import { baseURL } from "@/utils/constants";

const AuthContext = createContext<Auth>();

interface Auth {
  isAuthenticated: Accessor<boolean>,
  setIsAuthenticated: Setter<boolean>,
  handleSignIn: (credentials: SignIn) => Promise<void>,
  handleSignUp: (registration: SignUp) => Promise<void>,
  handleLogOut: () => Promise<void>,
  handleRecoverAccount: (account: string) => Promise<boolean>,
  handleResetPassword: (token: string, password: string) => Promise<void>
}

export default function AuthProvider(props: ParentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(true);
  const fetchService = new FetchService(baseURL.concat("/auth"));
  const authService = AuthService.getInstance(fetchService);
  const [_, {clearDatabase}] = useIndexedDB();
  const navigate = useNavigate();
  const notify = useToast();

  async function handleSignIn(credentials: SignIn) {
    notify.loading("Logging...");
    await sleep(1000);
    const {status, message} = await authService.signIn(credentials);

    if (status === "error") {
      notify.error(message);
      return;
    }

    notify.success(message);
    setIsAuthenticated(true);
    navigate("/");
  }

  async function handleSignUp(registration: SignUp) {
    notify.loading("Registering...");
    await sleep(1000);
    const {status, message} = await authService.signUp(registration);

    if (status === "error") {
      notify.error(message);
      return;
    }

    notify.success(message);
    navigate("/auth/sign-in");
  }

  async function handleLogOut() {
    notify.loading("Logging out...");
    await sleep(1000);
    const {status, message} = await authService.logOut();

    if (status === "error") {
      notify.error(message);
      return;
    }

    localStorage.clear();
    await clearDatabase();
    notify.success(message);
    setIsAuthenticated(false);
    navigate("/auth/sign-in");
  }

  async function handleRecoverAccount(account: string) {
    notify.loading("Sending email...");
    await sleep(1000);
    const {status, message} = await authService.recoverAccount(account);

    if (status === "error") {
      notify.error(message);
      return false;
    }

    notify.success(message);
    return true;
  }

  async function handleResetPassword(token: string, password: string) {
    notify.loading("Resetting Password...");
    await sleep(1000);
    const {status, message} = await authService.resetPassword(token, password);

    if (status === "error") {
      notify.error(message);
      navigate("/auth/recover-account");
      return;
    }

    notify.success(message);
    navigate("/auth/sign-in");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, handleSignIn, handleSignUp, handleLogOut, handleRecoverAccount, handleResetPassword }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): Auth => useContext(AuthContext) as unknown as Auth;

export function AuthRoute(props: ParentProps) {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();

  // (async () => {
  //   const {status, message} = await AuthService.status();

  //   if (status === "error") {
  //     notify.error(message);
  //     navigate("/auth/sign-in");
  //     return;
  //   }

  //   notify.success(message);
  //   setIsAuthenticated(true);
  // })();

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
}