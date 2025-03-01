import { Accessor, Setter, createContext, createSignal, ParentProps, useContext, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import AuthService from "@services/auth";
import type { Login, Register } from "@services/auth/interfaces";
import { useIndexedDB } from "../indexedDB";

const AuthContext = createContext<Auth>();

interface Auth {
  isAuthenticated: Accessor<boolean>,
  setIsAuthenticated: Setter<boolean>,
  status: () => Promise<void>,
  handleLogin: (credentials: Login) => Promise<void>,
  handleRegister: (registration: Register) => Promise<void>,
  handleActivateAccount: (token: string) => Promise<void>,
  handleLogout: () => Promise<void>,
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

  async function handleLogin(credentials: Login) {
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  async function handleRegister(registration: Register) {
    try {
      await authService.register(registration);
      navigate("/auth/login");      
    } catch {}
  }

  async function handleActivateAccount(token: string) {
    try {
      await authService.activateAccount(token);
      navigate("/auth/login");
    } catch (error) {
      navigate("/auth/login");
    }
  }

  async function handleLogout() {
    try {
      await authService.logout();
      
      localStorage.clear();
      await clearDatabase();
      setIsAuthenticated(false);
      navigate("/auth/login");
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
      navigate("/auth/login");
    } catch (error) {
      navigate("/auth/recover-account");
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      status,
      handleLogin,
      handleRegister,
      handleActivateAccount,
      handleLogout,
      handleRecoverAccount,
      handleResetPassword
    }}>
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
      navigate("/auth/login");
    }
  });

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
}