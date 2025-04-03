import { useContext } from "solid-js";
import { ProfileContext, ProfileContextType } from "../context/profileContext";

const useProfileContext = () => useContext(ProfileContext) as ProfileContextType;
export default useProfileContext;
