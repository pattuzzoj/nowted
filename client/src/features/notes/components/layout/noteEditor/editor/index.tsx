import { createTiptapEditor } from 'solid-tiptap';
import type { Editor as IEditor } from '@tiptap/core';
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
import useData from "@/features/notes/hooks/useData";
import TypographMenu from './menus/typographMenu';
import SizeMenu from './menus/sizeMenu';
import AlignMenu from './menus/alignMenu';
import MarkingMenu from './menus/markingMenu';
import MediaMenu from './menus/mediaMenu';
import { debounce } from '@utilify/core';
import { createEffect, createSignal, onCleanup } from 'solid-js';

export default function Editor() {
  const [data, { updateNote }] = useData();
  const [note, setNote] = createSignal(data.note);

  let editorElement;

  const save = debounce(async (note) => {
    await updateNote(note);
  }, 1000);

  const editor = createTiptapEditor(() => ({
    element: editorElement!,
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
        class: "h-full grow focus-visible:outline-0"
      }
    },
    content: "",
    onCreate: (props) => {
      setTimeout(() => props.editor.commands.setContent(data.note.content), 300);
    },
    onUpdate: (props) => {
      setNote({...note(), preview: props.editor.getText().slice(0, 30), content: props.editor.getHTML()});
      save({ preview: note().preview, content: note().content });
    },
    onDestroy: async () => {
      await updateNote({ preview: note().preview, content: note().content });
    },
  })) as unknown as () => IEditor;

  return (
    <>
      <div class="flex items-center gap-4 overflow-x-scroll">
        <span class="flex items-center gap-1">
          <TypographMenu editor={editor} />
          <SizeMenu editor={editor} />
        </span>
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <AlignMenu editor={editor} />
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <MarkingMenu editor={editor} />
        <span class="flex items-center text-tertiary font-extrabold">|</span>
        <MediaMenu editor={editor} />
      </div>
      <div id="editor" role="textbox" aria-multiline="true" class="flex grow focus-visible:outline-0 rounded-lg p-4 bg-layout-secondary h-96 overflow-y-scroll" ref={editorElement} />
    </>
  )
}
