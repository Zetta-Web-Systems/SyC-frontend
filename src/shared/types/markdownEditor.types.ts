export const TEXT_ALIGN = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
  JUSTIFY: "justify",
} as const;

export type TextAlign = (typeof TEXT_ALIGN)[keyof typeof TEXT_ALIGN];

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface MarkdownEditorActions {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleStrike: () => void;
  toggleHighlight: () => void;
  setHighlightColor: (color: string) => void;
  unsetHighlight: () => void;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
  toggleTaskList: () => void;
  setTextAlign: (align: TextAlign) => void;
  setHeading: (level: HeadingLevel | null) => void;
  insertImage: (src: string, alt?: string) => void;
  insertLink: (href: string) => void;
  unsetLink: () => void;
  clearFormatting: () => void;
  undo: () => void;
  redo: () => void;
}

export interface MarkdownEditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isHighlight: boolean;
  highlightColor: string | null;
  isBulletList: boolean;
  isOrderedList: boolean;
  isTaskList: boolean;
  isLink: boolean;
  textAlign: TextAlign;
  headingLevel: HeadingLevel | null;
  canUndo: boolean;
  canRedo: boolean;
}
