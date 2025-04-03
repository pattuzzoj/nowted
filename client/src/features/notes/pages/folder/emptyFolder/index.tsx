import InfoIcon from "lucide-solid/icons/info";

interface EmptyFolderProps {
  name: string;
}

export default function EmptyFolder(props: EmptyFolderProps) {
  return (
    <div class="flex-1 flex flex-col items-center justify-center text-center gap-4 text-white/50">
      <InfoIcon class="size-8" />
      <h3>{props.name} is empty</h3>
    </div>
  );
}
