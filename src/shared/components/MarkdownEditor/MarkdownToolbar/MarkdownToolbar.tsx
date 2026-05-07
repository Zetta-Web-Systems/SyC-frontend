import { useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  HelpCircle,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListTodo,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { ME_HEADING_OPTIONS } from "@shared/constants/markdownEditor.constants";
import type {
  HeadingLevel,
  MarkdownEditorActions,
  MarkdownEditorState,
} from "@shared/types/markdownEditor.types";
import { TEXT_ALIGN } from "@shared/types/markdownEditor.types";
import { Select } from "@shared/ui/Select/Select";
import { MarkdownToolbarButton } from "./MarkdownToolbarButton";
import { MarkdownToolbarPopover } from "./MarkdownToolbarPopover";

interface MarkdownToolbarProps {
  actions: MarkdownEditorActions;
  state: MarkdownEditorState;
  disabled?: boolean;
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-neutral-200" aria-hidden="true" />;
}

export function MarkdownToolbar({
  actions,
  state,
  disabled,
}: MarkdownToolbarProps) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const shortcutsButtonRef = useRef<HTMLButtonElement>(null);

  const handleInsertImage = () => {
    const src = window.prompt("URL de la imagen", "https://");
    if (!src) return;
    actions.insertImage(src);
  };

  const handleLinkClick = () => {
    if (state.isLink) {
      actions.unsetLink();
      return;
    }
    const href = window.prompt("URL del enlace", "https://");
    if (!href) return;
    actions.insertLink(href);
  };

  const handleHeadingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = event.target.value;
    if (raw === "") {
      actions.setHeading(null);
      return;
    }
    actions.setHeading(Number(raw) as HeadingLevel);
  };

  const headingValue =
    state.headingLevel === null ? "" : String(state.headingLevel);

  return (
    <div
      role="toolbar"
      aria-label="Formato de texto"
      className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5"
    >
      {/* Deshacer / Rehacer */}
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

      <Divider />

      {/* Headings */}
      <div className="w-36">
        <Select
          size="sm"
          value={headingValue}
          onChange={handleHeadingChange}
          disabled={disabled}
          aria-label="Estilo de texto"
        >
          {ME_HEADING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <Divider />

      {/* Formateo (Marks) */}
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
        onClick={actions.toggleUnderline}
        active={state.isUnderline}
        disabled={disabled}
        label="Subrayado"
      >
        <UnderlineIcon size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={actions.toggleStrike}
        active={state.isStrike}
        disabled={disabled}
        label="Tachado"
      >
        <Strikethrough size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <Divider />

      {/* Alineado */}
      <MarkdownToolbarButton
        onClick={() => actions.setTextAlign(TEXT_ALIGN.LEFT)}
        active={state.textAlign === TEXT_ALIGN.LEFT}
        disabled={disabled}
        label="Alinear a la izquierda"
      >
        <AlignLeft size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={() => actions.setTextAlign(TEXT_ALIGN.CENTER)}
        active={state.textAlign === TEXT_ALIGN.CENTER}
        disabled={disabled}
        label="Centrar"
      >
        <AlignCenter size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={() => actions.setTextAlign(TEXT_ALIGN.RIGHT)}
        active={state.textAlign === TEXT_ALIGN.RIGHT}
        disabled={disabled}
        label="Alinear a la derecha"
      >
        <AlignRight size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={() => actions.setTextAlign(TEXT_ALIGN.JUSTIFY)}
        active={state.textAlign === TEXT_ALIGN.JUSTIFY}
        disabled={disabled}
        label="Justificar"
      >
        <AlignJustify size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <Divider />

      {/* Puntitos de listado */}
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
      <MarkdownToolbarButton
        onClick={actions.toggleTaskList}
        active={state.isTaskList}
        disabled={disabled}
        label="Lista de tareas"
      >
        <ListTodo size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <Divider />

      {/* Source */}
      <MarkdownToolbarButton
        onClick={handleInsertImage}
        disabled={disabled}
        label="Insertar imagen"
      >
        <ImageIcon size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      <MarkdownToolbarButton
        onClick={handleLinkClick}
        active={state.isLink}
        disabled={disabled}
        label="Insertar enlace"
      >
        <LinkIcon size={16} aria-hidden="true" />
      </MarkdownToolbarButton>

      <Divider />

      {/* Utilidad */}
      <MarkdownToolbarButton
        ref={shortcutsButtonRef}
        onClick={() => setShortcutsOpen((v) => !v)}
        active={shortcutsOpen}
        disabled={disabled}
        label="Atajos de teclado"
      >
        <HelpCircle size={16} aria-hidden="true" />
      </MarkdownToolbarButton>
      {shortcutsOpen && (
        <MarkdownToolbarPopover
          anchorRef={shortcutsButtonRef}
          onClose={() => setShortcutsOpen(false)}
        />
      )}
    </div>
  );
}
