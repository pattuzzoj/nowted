import { createContext, onMount, ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import ProfileService from "../services/userService";

export type ProfileContextType = [
  user: {username: string, email: string},
  {
    checkUsername: (username: string) => Promise<boolean>,
    checkEmail: (email: string) => Promise<boolean>,
    changeUsername: (username: string, password: string) => Promise<void>,
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>,
    requestChangeEmail: (email: string, password: string) => Promise<void>,
    confirmChangeEmail: (pin: string) => Promise<void>,
    deleteData: () => Promise<void>,
    deleteAccount: () => Promise<void>
  }
]

export const ProfileContext = createContext<ProfileContextType>();

export default function ProfileContextProvider(props: ParentProps) {
  const [profile, setProfile] = createStore({
    username: "john_doe",
    email: "johndoe@mail.com"
  });

  const userService = ProfileService.getInstance(profile, setProfile);

  onMount(async () => {
    const data = await userService.getProfile();

    if (data) {
      setProfile(data);
    }
  });

  async function changeUsername(username: string, password: string) {
    const changedUsername = await userService.changeUsername(username, password);

    if (changedUsername) {
      setProfile({ username: username });
    }
  }

  return (
    <ProfileContext.Provider value={[
      profile,
      {
        checkUsername:  userService.checkUsername.bind(userService),
        checkEmail: userService.checkEmail.bind(userService),
        changeUsername,
        changePassword: userService.changePassword.bind(userService),
        requestChangeEmail: userService.requestChangeEmail.bind(userService),
        confirmChangeEmail: userService.confirmChangeEmail.bind(userService),
        deleteData: userService.deleteData.bind(userService),
        deleteAccount: userService.deleteAccount.bind(userService),
      }
    ]}>
      {props.children}
    </ProfileContext.Provider>
  )
}
