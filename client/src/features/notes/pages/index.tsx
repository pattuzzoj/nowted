import { ParentProps } from "solid-js";
import DataContextProvider from "@/features/notes/context/dataContext";
import PrivateRoute from "@/features/auth/components/privateRoute";
import Sidebar from "../components/layout/sidebar";
import ProfileContextProvider from "@/features/profile/context/profileContext";

export default function App(props: ParentProps) {
  return (
    <PrivateRoute>
      <DataContextProvider>
        <ProfileContextProvider>
          <div class="w-screen h-screen flex max-md:flex-col">
            <Sidebar />
            <main class="h-full w-full flex justify-center items-center">
              {props.children}
            </main>
          </div>
        </ProfileContextProvider>
      </DataContextProvider>
    </PrivateRoute>
  )
}
