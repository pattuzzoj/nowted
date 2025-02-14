import { debounce, formatDate } from "@utilify/core";
import { ParentProps } from "solid-js";
import { createTiptapEditor } from 'solid-tiptap';
import CalendarDays from "lucide-solid/icons/calendar-days";
import Folder from "lucide-solid/icons/folder";
import ImagePlus from "lucide-solid/icons/image-plus";
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from "@tiptap/extension-link";
import Image from '@tiptap/extension-image';
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "tiptap-extension-font-size";
import MarkingMenu from "./markingMenu";
import TypographMenu from "./typographMenu";
import AlignMenu from "./alignMenu";
import SizeMenu from "./sizeMenu";
import { useData } from "@context/data";


interface EditorProps extends ParentProps { }

export default function Editor(props: EditorProps) {
  const [data, {noteService}] = useData();
  let ref: HTMLDivElement;

  const save = debounce(noteService.updateContent, 3000);

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Subscript,
      Superscript,
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ["left", "right", "center", "justify"]
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: "size-16"
        }
      }),
      Link.configure({
        defaultProtocol: "https",
        protocols: [
          "www"
        ],  
        openOnClick: true,
        linkOnPaste: true,
      })
    ],
    editorProps: {
      attributes: {
        class: "grow focus-visible:outline-0"
      }
    },
    content: data.note.content,
    onUpdate: (props) => {
      save(data.note.id, props.editor.getText().slice(0, 30), props.editor.getHTML());
    }
  }));

  // const toggleLink = () => editor()?.chain().focus().toggleLink({href:"www.google.com"}).run();
  // const setLink = (href: string) => editor()?.chain().focus().extendMarkRange("link").setLink({href, target: "_blank"}).run();
  // const setImage = (title: string, src: string) => editor()?.chain().focus().setImage({src, title}).run();

  // function handlerUploadImage(e) {
  //   const files = e.target.files;
    
  //   for (const file of files) {
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       setImage(e.target!.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // function handlerSetImage(e) {
  //   const title = window.prompt("Title: ");
  //   const url = window.prompt("URL: ");
  //   setImage(title, url);
  // }

  // function handlerSetLink() {
  //   const url = window.prompt("");
  //   const novaurl = new URL(url);
  //   setLink(novaurl);
  // }

  return (
    <div class="h-screen max-md:w-screen md:basis-full flex flex-col gap-4 p-4 bg-primary">
      <div class="flex justify-between items-center">
        <h2 contentEditable>{data.note.name}</h2>
      </div>
      <span class="flex gap-4">
        <span class="flex items-center gap-2">
          <CalendarDays class="size-4" />
          Date
        </span>
        {formatDate(new Date(data.note.created_at), "DMY")}
      </span>
      <hr class="text-white/20" />
      <span class="flex gap-4">
        <span class="flex items-center gap-2">
          <Folder class="size-4" />
          Date
        </span>
        {data.folder.name}
      </span>
      <hr class="text-white/20" />
      <div class="flex max-md:flex-col items-start md:items-center gap-4">
        <span class="flex justify-between items-center space-x-1">
          <TypographMenu editor={editor}/>
          <SizeMenu editor={editor}/>
        </span>
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <AlignMenu editor={editor}/>
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <span>
          <MarkingMenu editor={editor}/>
        </span>
        <span class="space-x-2">
          {/* <button title="image" class="p-2 rounded-lg hover:bg-tertiary" onClick={setImageHandler}>
            <ImagePlus class="size-5" />
          </button> */}
          {/* <label title="image" class="p-2 rounded-lg hover:bg-tertiary">
            <input class="hidden" type="file" accept="image/*" multiple onChange={setImageHandler} />
            <ImagePlus class="size-5" />
          </label>
          <button title="link" class="p-2 rounded-lg hover:bg-tertiary" onClick={setLinkHandler}>
            <Link class="size-5" />
          </button> */}
        </span>
        {/* <button title="table" class="p-2 rounded-lg hover:bg-tertiary">
          <Table class="size-5" />
        </button> */}
      </div>
      <div role="textbox" aria-multiline="true" class="flex grow focus-visible:outline-0 rounded-lg p-4 bg-tertiary" id="editor" ref={ref}/>
    </div>
  )
}