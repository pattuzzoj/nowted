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
    username: "",
    email: ""
  });

  const userService = ProfileService.getInstance(profile, setProfile);

  onMount(async () => {
    const result = await userService.getProfile();
    
    if (result.success) {
      setProfile(result.data);
    }
  });

  return (
    <ProfileContext.Provider value={[
      profile,
      {
        checkUsername:  userService.checkUsername.bind(userService),
        checkEmail: userService.checkEmail.bind(userService),
        changeUsername: userService.changeUsername.bind(userService),
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
