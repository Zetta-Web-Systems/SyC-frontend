import { CircleCheck, CircleAlert, TriangleAlert, Info, X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui/Button/Button";
import { toastVariants, toastIconVariants } from "./Toast.variants";
import type { Toast as ToastType } from "@shared/stores/toast.store";

const INTENT_ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
} as const;

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ toast: t, onDismiss }: ToastProps) {
  const Icon = INTENT_ICONS[t.intent];

  return (
    <div role="alert" className={cn(toastVariants({ intent: t.intent }))}>
      <Icon
        size={20}
        aria-hidden="true"
        className={toastIconVariants({ intent: t.intent })}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900">{t.title}</p>
        {t.description && (
          <p className="mt-0.5 text-sm text-neutral-600">{t.description}</p>
        )}
      </div>

      {t.action && (
        <Button
          variant="ghost"
          size="sm"
          intent="neutral"
          className="shrink-0 self-center"
          onClick={t.action.onClick}
        >
          {t.action.label}
        </Button>
      )}

      <button
        type="button"
        aria-label="Cerrar notificación"
        onClick={() => onDismiss(t.id)}
        className="shrink-0 self-start p-0.5 text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

Toast.displayName = "Toast";
