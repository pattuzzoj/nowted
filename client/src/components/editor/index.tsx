import { debounce, formatDate } from "@utilify/core";
import { ParentProps } from "solid-js";
import { createTiptapEditor } from 'solid-tiptap';
import CalendarDays from "lucide-solid/icons/calendar-days";
import Folder from "lucide-solid/icons/folder";
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
import MediaMenu from "./mediaMenu";

export default function Editor() {
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
          class: "aspect-auto"
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

  return (
    <div class="h-screen max-md:w-screen md:basis-full flex flex-col gap-4 p-4 bg-primary">
      <div class="flex justify-between items-center">
        <h2 contentEditable>{data.note.name}</h2>
      </div>
      <span class="flex gap-4">
        <span class="flex items-center gap-2">
          <CalendarDays class="size-5" />
          Date
        </span>
        {formatDate(new Date(data.note.created_at), "DMY")}
      </span>
      <hr class="text-white/20" />
      <span class="flex gap-4">
        <span class="flex items-center gap-2">
          <Folder class="size-5" />
          Date
        </span>
        {data.folder.name}
      </span>
      <hr class="text-white/20" />
      <div class="flex max-md:overflow-x-scroll items-start md:items-center gap-4">
        <span class="flex justify-between items-center space-x-1">
          <TypographMenu editor={editor}/>
          <SizeMenu editor={editor}/>
        </span>
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <AlignMenu editor={editor}/>
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <MarkingMenu editor={editor}/>
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <MediaMenu editor={editor}/>
      </div>
      <div role="textbox" aria-multiline="true" class="flex grow focus-visible:outline-0 rounded-lg p-4 bg-tertiary overflow-y-scroll" id="editor" ref={ref}/>
    </div>
  )
}