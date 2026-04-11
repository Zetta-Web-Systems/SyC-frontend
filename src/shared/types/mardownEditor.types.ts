export interface MarkdownEditorActions {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleStrike: () => void;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
  toggleHeading: (level: 2 | 3) => void;
  undo: () => void;
  redo: () => void;
}

export interface MarkdownEditorState {
  isBold: boolean;
  isItalic: boolean;
  isStrike: boolean;
  isBulletList: boolean;
  isOrderedList: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  canUndo: boolean;
  canRedo: boolean;
}
