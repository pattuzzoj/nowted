import { Accessor, Setter, createContext, createSignal, ParentProps, useContext, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import AuthService from "@services/auth";
import type { SignIn, SignUp } from "@services/auth/interfaces";
import { useIndexedDB } from "../indexedDB";

const AuthContext = createContext<Auth>();

interface Auth {
  isAuthenticated: Accessor<boolean>,
  setIsAuthenticated: Setter<boolean>,
  status: () => Promise<void>,
  handleSignIn: (credentials: SignIn) => Promise<void>,
  handleSignUp: (registration: SignUp) => Promise<void>,
  handleLogOut: () => Promise<void>,
  handleRecoverAccount: (account: string) => Promise<void>,
  handleResetPassword: (token: string, password: string) => Promise<void>
}

export default function AuthProvider(props: ParentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const authService = AuthService.getInstance();
  const [_, { clearDatabase }] = useIndexedDB();
  const navigate = useNavigate();

  async function status() {
    await authService.isValidToken();
  }

  async function handleSignIn(credentials: SignIn) {
    try {
      await authService.signIn(credentials);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  async function handleSignUp(registration: SignUp) {
    try {
      await authService.signUp(registration);
      navigate("/auth/sign-in");      
    } catch {}
  }

  async function handleLogOut() {
    try {
      await authService.logOut();
      
      localStorage.clear();
      await clearDatabase();
      setIsAuthenticated(false);
      navigate("/auth/sign-in");
    } catch {}
  }

  async function handleRecoverAccount(account: string) {
    try {
      await authService.recoverAccount(account);
    } catch {}
  }

  async function handleResetPassword(token: string, password: string) {
    try {
      await authService.resetPassword(token, password);
      navigate("/auth/sign-in");
    } catch (error) {
      navigate("/auth/recover-account");
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, status, handleSignIn, handleSignUp, handleLogOut, handleRecoverAccount, handleResetPassword }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): Auth => useContext(AuthContext) as unknown as Auth;

export function AuthRoute(props: ParentProps) {
  const { isAuthenticated, setIsAuthenticated, status } = useAuth();
  const navigate = useNavigate();

  onMount(async () => {
    try {
      await status();
      setIsAuthenticated(true);
    } catch (error) {
      navigate("/auth/sign-in");
    }
  });

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
}