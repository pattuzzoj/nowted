import { createContext, createSignal, onMount, ParentProps, useContext } from "solid-js";
import { useNavigate } from "@solidjs/router";
import AuthService from "services/auth";
import { SignIn, SignUp } from "services/auth/interfaces";
import useToast from "hooks/useToast";
import { sleep } from "@utilify/core";

const AuthContext = createContext();

type Auth = [
  requireAuth: () => void,
  {
    handleSignIn: (credentials: SignIn) => Promise<void>,
    handleSignUp: (registration: SignUp) => Promise<void>,
    handleLogOut: () => Promise<void>,
    handleRecoverAccount: (account: string) => Promise<boolean>,
    handleResetPassword: (token: string, password: string) => Promise<void>
  }
]

export default function AuthProvider(props: ParentProps) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const navigate = useNavigate();
  const notify = useToast();

  onMount(async () => {
    try {
      const isLogged = await AuthService.status();

      setIsAuthenticated(Boolean(isLogged));
    } catch (error) {
      console.error(error);
    }
  });

  async function handleSignIn(credentials: SignIn) {
    notify.loading("Logging...");
    await sleep(1000);

    try {
      const isLogged = await AuthService.signIn(credentials);

      if (isLogged) {
        setIsAuthenticated(true);
        navigate("/");
        notify.success("User logged in successfully");
      } else {
        throw new Error();
      }
    } catch {
      notify.error("Invalid email or password");
    }
  }

  async function handleSignUp(registration: SignUp) {
    notify.loading("Registering...");
    await sleep(1000);

    try {
      const isRegistered = await AuthService.signUp(registration);

      if (isRegistered) {
        navigate("/auth/sign-in");
        notify.success("Successfully registered user");
      } else {
        throw new Error();
      }
    } catch {
      notify.error("Error registering");
    }
  }

  async function handleLogOut() {
    notify.loading("Logging out...");
    await sleep(1000);

    try {
      const isLoggedOut = await AuthService.logOut();

      if (isLoggedOut) {
        setIsAuthenticated(false);
        navigate("/auth/sign-in");
        notify.success("Logged out successfully");
      } else {
        throw new Error();
      }
    } catch {
      notify.error("Error logging out");
    }
  }

  async function handleRecoverAccount(account: string) {
    notify.loading("Sending email...");
    await sleep(1000);

    try {
      const recoverAccountSent = await AuthService.recoverAccount(account);

      if (recoverAccountSent) {
        notify.success(`Email sent to ${account}`);
        return true;
      } else {
        throw new Error();
      }
    } catch {
      notify.error("Error");
      return false;
    }
  }

  async function handleResetPassword(token: string, password: string) {
    notify.loading("Resetting...");
    await sleep(1000);

    try {
      const passwordReseted = await AuthService.resetPassword(token, password);

      if (passwordReseted) {
        navigate("/auth/sign-in");
        notify.success("Password successfully changed");
      } else {
        throw new Error();
      }
    } catch {
      notify.error("Internal error");
      navigate("/auth/recover-account");
    }
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      navigate("/auth/sign-in");
    }
  }

  return (
    <AuthContext.Provider value={[requireAuth, { handleSignIn, handleSignUp, handleLogOut, handleRecoverAccount, handleResetPassword }]}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): Auth => useContext(AuthContext) as unknown as Auth;