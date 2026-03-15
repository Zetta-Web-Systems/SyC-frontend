import { useToastStore } from "@shared/stores/toast.store";
import { Toast } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      className="fixed flex flex-col items-center z-50 gap-3 bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
}

ToastContainer.displayName = "ToastContainer";
