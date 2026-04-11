import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";
import type {
  MarkdownEditorActions,
  MarkdownEditorState,
} from "@shared/types/mardownEditor.types";
import { MarkdownToolbarButton } from "./MarkdownToolbarButton";

interface MarkdownToolbarProps {
  actions: MarkdownEditorActions;
  state: MarkdownEditorState;
  disabled?: boolean;
}

export function MarkdownToolbar({
  actions,
  state,
  disabled,
}: MarkdownToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Formato de texto"
      className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5"
    >
      <MarkdownToolbarButton
        onClick={actions.toggleBold}
        active={state.isBold}
        disabled={disabled}
        label="Negrita"
      >
        <Bold size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={actions.toggleItalic}
        active={state.isItalic}
        disabled={disabled}
        label="Cursiva"
      >
        <Italic size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={actions.toggleStrike}
        active={state.isStrike}
        disabled={disabled}
        label="Tachado"
      >
        <Strikethrough size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden="true" />

      <MarkdownToolbarButton
        onClick={() => actions.toggleHeading(2)}
        active={state.isHeading2}
        disabled={disabled}
        label="Título"
      >
        <Heading2 size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={() => actions.toggleHeading(3)}
        active={state.isHeading3}
        disabled={disabled}
        label="Subtítulo"
      >
        <Heading3 size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden="true" />

      <MarkdownToolbarButton
        onClick={actions.toggleBulletList}
        active={state.isBulletList}
        disabled={disabled}
        label="Lista con viñetas"
      >
        <List size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={actions.toggleOrderedList}
        active={state.isOrderedList}
        disabled={disabled}
        label="Lista numerada"
      >
        <ListOrdered size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden="true" />

      <MarkdownToolbarButton
        onClick={actions.undo}
        disabled={disabled || !state.canUndo}
        label="Deshacer"
      >
        <Undo size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={actions.redo}
        disabled={disabled || !state.canRedo}
        label="Rehacer"
      >
        <Redo size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
    </div>
  );
}
