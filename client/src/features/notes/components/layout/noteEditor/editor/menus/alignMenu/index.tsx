import { createEffect, createSignal } from "solid-js";
import { createEditorTransaction } from "solid-tiptap";
import { Editor } from "@tiptap/core";
import AlignCenter from "lucide-solid/icons/align-center";
import AlignJustify from "lucide-solid/icons/align-justify";
import AlignLeft from "lucide-solid/icons/align-left";
import AlignRight from "lucide-solid/icons/align-right";


interface MarkProps {
  editor: () => Editor;
}

export default function AlignMenu(props: MarkProps) {
  const [isLeftActive, setIsLeftActive] = createSignal(false);
  const [isCenterActive, setIsCenterActive] = createSignal(false);
  const [isRightActive, setIsRightActive] = createSignal(false);
  const [isJustifyActive, setIsJustifyActive] = createSignal(false);

  createEffect(() => {
    createEditorTransaction(props.editor, (editor) => {
      setIsLeftActive(editor.isActive({textAlign: "left"}));
      setIsCenterActive(editor.isActive({textAlign: "center"}));
      setIsRightActive(editor.isActive({textAlign: "right"}));
      setIsJustifyActive(editor.isActive({textAlign: "justify"}));
    })();
  });

  const command = () => props.editor()?.chain().focus();

  const toggleAlignLeft = () => {
    if (isLeftActive()) {
      command().unsetTextAlign().run();
    } else {
      command().setTextAlign("left").run();
    }
  };

  const toggleAlignCenter = () => {
    if (isCenterActive()) {
      command().unsetTextAlign().run();
    } else {
      command().setTextAlign("center").run();
    }
  };

  const toggleAlignRight = () => {
    if (isRightActive()) {
      command().unsetTextAlign().run();
    } else {
      command().setTextAlign("right").run();
    }
  };

  const toggleAlignJustify = () => {
    if (isJustifyActive()) {
      command().unsetTextAlign().run();
    } else {
      command().setTextAlign("justify").run();
    }
  };

  return (
    <span class="flex gap-1">
      <button title="align-left" data-active={isLeftActive()} class="flex items-center btn btn-toggle" onClick={toggleAlignLeft}>
        <AlignLeft class="size-5" />
      </button>
      <button title="align-center" data-active={isCenterActive()} class="flex items-center btn btn-toggle" onClick={toggleAlignCenter}>
        <AlignCenter class="size-5" />
      </button>
      <button title="align-right" data-active={isRightActive()} class="flex items-center btn btn-toggle" onClick={toggleAlignRight}>
        <AlignRight class="size-5" />
      </button>
      <button title="justify" data-active={isJustifyActive()} class="flex items-center btn btn-toggle" onClick={toggleAlignJustify}>
        <AlignJustify class="size-5" />
      </button>
    </span>
  )
}
