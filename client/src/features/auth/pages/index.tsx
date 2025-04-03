import { ParentProps } from "solid-js";
import { A } from "@solidjs/router";
import Logo from "@/shared/components/logo";

export default function AuthLayout(props: ParentProps) {
  return (
    <div class="flex flex-col items-center justify-center bg-layout-primary h-screen">
      <A title="Nowted" href="/" class="size-40">
        <Logo />
      </A>
      {props.children}
    </div>
  )
}
