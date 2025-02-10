import { Accessor, createContext, createSignal, onMount, ParentProps, useContext } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { sleep } from "@utilify/core";
import AuthService from "@services/auth";
import type { SignIn, SignUp } from "@services/auth/interfaces";
import useToast from "@hooks/useToast";

const AuthContext = createContext<Auth>();

interface Auth {
  isAuthenticated: Accessor<boolean>,
  handleSignIn: (credentials: SignIn) => Promise<void>,
  handleSignUp: (registration: SignUp) => Promise<void>,
  handleLogOut: () => Promise<void>,
  handleRecoverAccount: (account: string) => Promise<boolean>,
  handleResetPassword: (token: string, password: string) => Promise<void>
}

export default function AuthProvider(props: ParentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const navigate = useNavigate();
  const notify = useToast();

  onMount(async () => {
    notify.loading("Logging...");
    await sleep(1000);
    const {status, message} = await AuthService.status();

    if (status === "error") {
      notify.error(message);
      navigate("/auth/sign-in");
      return;
    }

    notify.success(message);
    setIsAuthenticated(true);
  });

  async function handleSignIn(credentials: SignIn) {
    notify.loading("Logging...");
    await sleep(1000);
    const {status, message} = await AuthService.signIn(credentials);

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
    const {status, message} = await AuthService.signUp(registration);

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
    const {status, message} = await AuthService.logOut();

    if (status === "error") {
      notify.error(message);
      return;
    }

    notify.success(message);
    setIsAuthenticated(false);
    navigate("/auth/sign-in");
  }

  async function handleRecoverAccount(account: string) {
    notify.loading("Sending email...");
    await sleep(1000);
    const {status, message} = await AuthService.recoverAccount(account);

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
    const {status, message} = await AuthService.resetPassword(token, password);

    if (status === "error") {
      notify.error(message);
      navigate("/auth/recover-account");
      return;
    }

    notify.success(message);
    navigate("/auth/sign-in");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleSignIn, handleSignUp, handleLogOut, handleRecoverAccount, handleResetPassword }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): Auth => useContext(AuthContext) as unknown as Auth;

export function AuthRoute(props: ParentProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    navigate("/auth/sign-in");
    return;
  }

  return props.children;
}