import { JSX, JSXElement, splitProps, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useRoot } from "../root";

interface TriggerProps extends JSX.HTMLAttributes<HTMLElement> {
  action: "open" | "close" | "toggle";
  as?: ValidComponent;
  children: JSXElement;
  [key: string]: any;
}

export default function Trigger(props: TriggerProps) {
  const [local, inner] = splitProps(props, ["action", "as", "children"]);
  const [isActive, setIsActive] = useRoot();
  let handleClick;

  if (local.action === "open") {
    handleClick = () => setIsActive(true);
  } else if(local.action === "close") {
    handleClick = () => setIsActive(false);
  } else if (local.action === "toggle") {
    handleClick = () => setIsActive(!isActive());
  }

  return (
    <Dynamic component={local.as || "button"} onClick={handleClick} {...inner} children={local.children} />
  )
}