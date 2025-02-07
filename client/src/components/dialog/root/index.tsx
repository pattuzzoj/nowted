import { Accessor, createContext, createEffect, createSignal, on, ParentProps, Setter, useContext } from "solid-js";

const RootContext = createContext();

export interface RootProps extends ParentProps {
  opened?: boolean;
  onClose?: () => void;
}

export default function Root(props: RootProps) {
  const [isActive, setIsActive] = createSignal(props.opened);

  createEffect(on(isActive, () => props.onClose?.()));

  return (
    <RootContext.Provider value={[isActive, setIsActive]}>
      {props.children}
    </RootContext.Provider>
  )
}

export const useRoot = () => useContext(RootContext) as [
  Accessor<boolean>,
  Setter<boolean>
];