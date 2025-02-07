import { ParentProps } from "solid-js";
import logo from "assets/logo.svg";
import AuthProvider from "context/auth";

export default function Auth(props: ParentProps) {
  return (
    <AuthProvider>
      <div class="flex flex-col items-center justify-center bg-primary h-screen">
        <a href="/">
          <img class="size-40" src={logo} alt="" />
        </a>
        {props.children}
      </div>
    </AuthProvider>
  )
}