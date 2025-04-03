import { JSX, Show, splitProps } from "solid-js";

interface Input extends JSX.InputHTMLAttributes<HTMLInputElement> {
  icon?: JSX.Element;
  dirty?: boolean;
  error?: string;
}

export default function Input(props: Input) {
  const [local, attrs] = splitProps(props, ["icon", "dirty", "error"]);
  const hasIcon = Boolean(local.icon);

  return (
    <span class="w-full relative">
      <label class="flex flex-col relative">
        <Show when={hasIcon}>
          <span class="absolute top-1/2 -translate-y-1/2 left-2">{local.icon}</span>
        </Show>
        <input data-dirty={local.dirty} data-error={Boolean(local.error)} data-has-icon={hasIcon} class="peer p-2 data-[has-icon=true]:pl-9 rounded-lg bg-layout-tertiary disabled:cursor-not-allowed outline-0 border-1 border-transparent data-[dirty=true]:data-[error=false]:border-blue-700 data-[error=true]:border-red-700" {...attrs} placeholder="" />
        <span class="absolute -top-5 left-0 text-xs peer-placeholder-shown:ml-8 peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base transition-all">
          {attrs.placeholder}
        </span>
      </label>
      <Show when={local.error}>
        <span class="text-sm text-red-400">{local.error}</span>
      </Show>
    </span>
  )
}
