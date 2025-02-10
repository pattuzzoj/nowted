import { A } from "@solidjs/router";
import Logo from "@components/logo";

export default function NotFound() {
  return (
    <div class="flex flex-col items-center justify-center bg-primary h-screen">
      <A title="Nowted" class="size-40" href="/">
        <Logo />
      </A>
      <h1>Page Not Found</h1>
    </div>
  );
}