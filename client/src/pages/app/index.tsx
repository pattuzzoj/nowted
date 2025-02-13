import { ParentProps } from "solid-js";
import LayoutMenu from "@/components/layoutMenu";
import { AuthRoute } from "@context/auth";
import DataProvider from "@context/data";

export default function App(props: ParentProps) {
  return (
    <AuthRoute>
      <DataProvider>
        <div class="w-screen h-screen flex max-md:flex-col">
          <LayoutMenu />
          {props.children}
        </div>
      </DataProvider>
    </AuthRoute>
  )
}