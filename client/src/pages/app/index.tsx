import { ParentProps } from "solid-js";
import Sidebar from "@components/sidebar";
import { AuthRoute } from "@context/auth";
import DataProvider from "@context/data";

export default function App(props: ParentProps) {
  return (
    <AuthRoute>
      <DataProvider>
        <div class="flex w-screen">
          <Sidebar />
          <div class="md:flex md:grow"></div>
          {props.children}
        </div>
      </DataProvider>
    </AuthRoute>
  )
}