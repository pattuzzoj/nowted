import { JSXElement, JSX, splitProps } from "solid-js";

interface Input extends JSX.InputHTMLAttributes<HTMLInputElement> {
  icon: JSXElement;
  children?: JSXElement;
}

export default function InputIcon(props: Input) {
  const [local, inner] = splitProps(props, ["children"]);

  return (
    <span class="relative">
      <label class="flex flex-col relative">
        <span class="absolute top-1/2 -translate-y-1/2 left-2">{props.icon}</span>
        <input class="peer p-2 pl-10 rounded-lg bg-tertiary disabled:cursor-not-allowed" {...inner} placeholder="" />
        <span class="absolute -top-5 left-0 text-xs peer-placeholder-shown:ml-8 peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base transition-all">
          {inner.placeholder}
        </span>
      </label>
      {local?.children}
    </span>
  )
}