import Sidebar from "components/sidebar";
import AuthProvider, { useAuth } from "context/auth";
import { ParentProps } from "solid-js";

export default function App(props: ParentProps) {
  return (
    <AuthProvider>
      <div class="flex w-screen">
        <Sidebar />
        <div class="md:flex md:grow"></div>
        {props.children}
      </div>
    </AuthProvider>
  )
}