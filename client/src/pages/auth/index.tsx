import { ParentProps, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import Logo from "@components/logo";
import Loading from "@/components/loading";

export default function Auth(props: ParentProps) {
  return (
    <Suspense fallback={<Loading/>}>
      <div class="flex flex-col items-center justify-center bg-primary h-screen">
        <A title="Nowted" href="/" class="size-40">
          <Logo />
        </A>
        {props.children}
      </div>
    </Suspense>
  )
}