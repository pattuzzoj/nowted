import { createEffect, createSignal } from "solid-js";
import { createEditorTransaction } from "solid-tiptap";
import { Editor } from "@tiptap/core";
import Bold from "lucide-solid/icons/bold";
import Highlighter from "lucide-solid/icons/highlighter";
import Italic from "lucide-solid/icons/italic";
import Strikethrough from "lucide-solid/icons/strikethrough";
import Subscript from "lucide-solid/icons/subscript";
import Superscript from "lucide-solid/icons/superscript";
import Underline from "lucide-solid/icons/underline";


interface MarkProps {
  editor: () => Editor;
}

export default function MarkingMenu(props: MarkProps) {
  const [isBold, setIsBold] = createSignal(false);
  const [isItalic, setIsItalic] = createSignal(false);
  const [isUnderline, setIsUnderline] = createSignal(false);
  const [isStrike, setIsStrike] = createSignal(false);
  const [isHighlight, setIsHighlight] = createSignal(false);
  const [isSubscript, setIsSubscript] = createSignal(false);
  const [isSuperscript, setIsSuperscript] = createSignal(false);

  createEffect(() => {
    createEditorTransaction(props.editor, (editor) => {
      setIsBold(editor.isActive("bold"));
      setIsItalic(editor.isActive("italic"));
      setIsUnderline(editor.isActive("underline"));
      setIsStrike(editor.isActive("strike"));
      setIsHighlight(editor.isActive("highlight"));
      setIsSubscript(editor.isActive("subscript"));
      setIsSuperscript(editor.isActive("superscript"));
    })();
  });

  const toggleBold = () => props.editor().commands.toggleBold();
  const toggleItalic = () => props.editor().chain().focus().toggleItalic().run();
  const toggleUnderline = () => props.editor().chain().focus().toggleUnderline().run();
  const toggleStrike = () => props.editor().chain().focus().toggleStrike().run();
  const toggleHighlight = () => props.editor().chain().focus().toggleHighlight().run();
  const toggleSubscript = () => props.editor().chain().focus().toggleSubscript().run();
  const toggleSupercript = () => props.editor().chain().focus().toggleSuperscript().run();

  return (
    <span class="flex gap-1">
      <button title="bold" data-active={isBold()} class="flex items-center btn btn-toggle" onClick={toggleBold}>
        <Bold class="size-5" />
      </button>
      <button title="italic" data-active={isItalic()} class="flex items-center btn btn-toggle" onClick={toggleItalic}>
        <Italic class="size-5" />
      </button>
      <button title="underline" data-active={isUnderline()} class="flex items-center btn btn-toggle" onClick={toggleUnderline}>
        <Underline class="size-5" />
      </button>
      <button title="strike" data-active={isStrike()} class="flex items-center btn btn-toggle" onClick={toggleStrike}>
        <Strikethrough class="size-5" />
      </button>
      <button title="highlight" data-active={isHighlight()} class="flex items-center btn btn-toggle" onClick={toggleHighlight}>
        <Highlighter class="size-5" />
      </button>
      <button title="subscript" data-active={isSubscript()} class="flex items-center btn btn-toggle" onClick={toggleSubscript}>
        <Subscript class="size-5" />
      </button>
      <button title="superscript" data-active={isSuperscript()} class="flex items-center btn btn-toggle" onClick={toggleSupercript}>
        <Superscript class="size-5" />
      </button>
    </span>
  )
}