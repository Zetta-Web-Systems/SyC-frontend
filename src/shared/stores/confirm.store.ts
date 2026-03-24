import type { ReactNode } from "react";
import { createStore } from "@shared/lib/createStore";

const CONFIRM_INTENT = {
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
} as const;

type ConfirmIntent = (typeof CONFIRM_INTENT)[keyof typeof CONFIRM_INTENT];

interface ConfirmOptions {
  intent?: ConfirmIntent;
  icon?: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
}

interface ConfirmState {
  options: ConfirmOptions | null;
  isLoading: boolean;
  open: (options: ConfirmOptions) => void;
  handleConfirm: () => Promise<void>;
  close: () => void;
}

export const useConfirmStore = createStore<ConfirmState>(
  "confirm",
  (set, get) => ({
    options: null,
    isLoading: false,
    open: (options) => set({ options, isLoading: false }),
    handleConfirm: async () => {
      const { options } = get();
      if (!options) return;
      set({ isLoading: true });
      try {
        await options.onConfirm();
      } finally {
        set({ options: null, isLoading: false });
      }
    },
    close: () => set({ options: null, isLoading: false }),
  }),
);

export function confirm(options: ConfirmOptions) {
  useConfirmStore.getState().open(options);
}

export { CONFIRM_INTENT };
export type { ConfirmIntent, ConfirmOptions };
