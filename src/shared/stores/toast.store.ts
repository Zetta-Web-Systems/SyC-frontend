import { createStore } from "@shared/lib/createStore";

const TOAST_INTENT = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

type ToastIntent = (typeof TOAST_INTENT)[keyof typeof TOAST_INTENT];

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  intent: ToastIntent;
  title: string;
  description?: string;
  action?: ToastAction;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">, duration?: number) => string;
  removeToast: (id: string) => void;
}

const DEFAULT_DURATION = 5000;

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const useToastStore = createStore<ToastState>("toast", (set, get) => ({
  toasts: [],
  addToast: (toast, duration = DEFAULT_DURATION) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { ...toast, id };
    set({ toasts: [...get().toasts, newToast] });
    const timer = setTimeout(() => {
      get().removeToast(id);
    }, duration);
    timers.set(id, timer);
    return id;
  },
  removeToast: (id) => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

function createToast(
  intent: ToastIntent,
  title: string,
  options?: { description?: string; action?: ToastAction; duration?: number },
) {
  return useToastStore.getState().addToast(
    {
      intent,
      title,
      description: options?.description,
      action: options?.action,
    },
    options?.duration,
  );
}

export const toast = {
  success: (
    title: string,
    options?: { description?: string; action?: ToastAction; duration?: number },
  ) => createToast("success", title, options),
  error: (
    title: string,
    options?: { description?: string; action?: ToastAction; duration?: number },
  ) => createToast("error", title, options),
  warning: (
    title: string,
    options?: { description?: string; action?: ToastAction; duration?: number },
  ) => createToast("warning", title, options),
  info: (
    title: string,
    options?: { description?: string; action?: ToastAction; duration?: number },
  ) => createToast("info", title, options),
};

export { TOAST_INTENT };
export type { ToastIntent, ToastAction, Toast };
