import { Accessor, Setter, createContext, createSignal, ParentProps, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import useIndexedDB from "@/shared/hooks/useIndexedDB";
import AuthService from "../services/authService";
import type { Login, Register } from "../types";

export interface Auth {
  isAuthenticated: Accessor<boolean>,
  setIsAuthenticated: Setter<boolean>,
  checkEmail: (email: string) => Promise<boolean>,
  checkUsername: (username: string) => Promise<boolean>,
  handleVerify: () => Promise<void>,
  handleLogin: (credentials: Login) => Promise<void>,
  handleRegister: (registration: Register) => Promise<void>,
  handleActivateAccount: (token: string) => Promise<void>,
  handleLogout: () => Promise<void>,
  handleRecoverAccount: (account: string) => Promise<void>,
  handleResetPassword: (token: string, password: string) => Promise<void>
}

export const AuthContext = createContext<Auth>();

export default function AuthProvider(props: ParentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const authService = AuthService.getInstance();
  const [_, { clearDatabase }] = useIndexedDB();
  const navigate = useNavigate();

  onMount(async () => {
    try {
      await authService.isValidToken();
      setIsAuthenticated(true);
    } catch (error) {
      navigate("/auth/login");
    }
  });

  async function handleVerify() {
    try {
      await authService.isValidToken();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      navigate("/auth/login");
    }
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
      return await authService.recoverAccount(account);
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
      checkEmail: authService.checkEmail.bind(authService),
      checkUsername: authService.checkUsername.bind(authService),
      handleVerify,
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
