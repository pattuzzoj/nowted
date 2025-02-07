import { JSXElement, JSX, splitProps, createSignal, Show } from "solid-js";
import Eye from "lucide-solid/icons/eye";
import EyeOff from "lucide-solid/icons/eye-off";

interface Input extends JSX.InputHTMLAttributes<HTMLInputElement> {
  children: JSXElement;
}

export default function Password(props: Input) {
  const [local, inner] = splitProps(props, ["children"]);
  const [isShown, setIsShown] = createSignal(false);

  return (
    <span>
      <label class="flex flex-col relative">
        <input {...inner} class="peer p-2 rounded-lg bg-tertiary" type={isShown() ? "text" : "password"} placeholder="" />
        <span class="absolute -top-5 left-0 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base transition-all">
          {inner.placeholder}
        </span>
        <span class="absolute top-1/2 -translate-y-1/2 right-2 flex items-center">
          <Show when={isShown()} fallback={<button onClick={() => setIsShown(true)}><EyeOff color="white" size={24}/></button>}>
            <button onClick={() => setIsShown(false)}>
              <Eye color="white" size={24}/>
            </button>
          </Show>
        </span>
      </label>
      {local.children}
    </span>
  )
}