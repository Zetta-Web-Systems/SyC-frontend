import type { CSSProperties } from "react";
import { X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui";
import { INTENT_ICONS } from "@shared/constants/toast.constants";
import { useToastTimer } from "@shared/hooks/useToastTimer";
import type { Toast as ToastType } from "@shared/stores/toast.store";
import {
  toastVariants,
  toastProgressVariants,
  toastIconVariants,
} from "./Toast.variants";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ toast: t, onDismiss }: ToastProps) {
  const Icon = INTENT_ICONS[t.intent];
  const { isPaused, onMouseEnter, onMouseLeave } = useToastTimer(
    t.id,
    t.duration,
    onDismiss,
  );

  return (
    <div
      role="alert"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ "--toast-duration": `${t.duration}ms` } as CSSProperties}
      className={cn(
        toastVariants({ intent: t.intent }),
        toastProgressVariants({ intent: t.intent }),
        isPaused && "after:[animation-play-state:paused]",
        !t.description && "items-center",
      )}
    >
      <Icon
        size={20}
        aria-hidden="true"
        className={toastIconVariants({ intent: t.intent })}
      />

      <div
        className={cn("flex-1 min-w-0", !t.description && "flex items-center")}
      >
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
        className="shrink-0 p-0.5 text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

Toast.displayName = "Toast";
