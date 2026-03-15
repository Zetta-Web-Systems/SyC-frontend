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
      className="fixed bottom-4 left-4 right-4 z-50 flex flex-col items-center gap-3 sm:left-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
}

ToastContainer.displayName = "ToastContainer";
