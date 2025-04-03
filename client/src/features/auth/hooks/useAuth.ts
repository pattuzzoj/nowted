import { useContext } from "solid-js";
import { Auth, AuthContext } from "../context/authContext";

const useAuth = () => useContext(AuthContext) as Auth;
export default useAuth;
