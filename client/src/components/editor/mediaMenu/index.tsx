import { Editor } from "@tiptap/core";
import ImagePlus from "lucide-solid/icons/image-plus";
import ImageUp from "lucide-solid/icons/image-up";
import Link from "lucide-solid/icons/link";

interface MarkProps {
  editor: () => Editor;
}

export default function MediaMenu(props: MarkProps) {
  const toggleLink = () => props.editor()?.chain().focus().toggleLink({href:"www.google.com"}).run();
  const setLink = (href: string) => props.editor()?.chain().focus().extendMarkRange("link").setLink({href, target: "_blank"}).run();
  const setImage = (title: string, src: string) => props.editor()?.chain().focus().setImage({src, title}).run();

  function handlerUploadImage(e) {
    const files = e.target.files;
    
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImage(undefined, e.target!.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handlerSetImage(e) {
    const title = window.prompt("Title: ");
    const url = window.prompt("URL: ");
    setImage(title, url);
  }

  function handlerSetLink() {
    const url = window.prompt("");
    const novaurl = new URL(url);
    setLink(novaurl);
  }

  return (
    <span class="flex gap-1">
      <button title="image" class="btn" onClick={handlerSetImage}>
        <ImagePlus class="size-5" />
      </button>
      <label title="image" class="btn cursor-pointer">
        <input class="hidden" type="file" accept="image/*" multiple onChange={handlerUploadImage} />
        <ImageUp class="size-5" />
      </label>
      <button title="link" class="btn" onClick={handlerSetLink}>
        <Link class="size-5" />
      </button>
    </span>
  )
}