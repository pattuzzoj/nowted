import { JSXElement, JSX, splitProps } from "solid-js";

interface Input extends JSX.InputHTMLAttributes<HTMLInputElement> {
  children?: JSXElement;
}

export default function Input(props: Input) {
  const [local, inner] = splitProps(props, ["children"]);

  return (
    <span class="relative">
      <label class="flex flex-col relative">
        <input class="peer p-2 rounded-lg bg-tertiary" {...inner} placeholder="" />
        <span class="absolute -top-5 left-0 text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base transition-all">
          {inner.placeholder}
        </span>
      </label>
      {local?.children}
    </span>
  )
}