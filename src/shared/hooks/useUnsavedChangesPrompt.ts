import { useEffect, useRef } from "react";
import { useBlocker } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";

interface UseUnsavedChangesPromptOptions {
  when: boolean;
  allowNavigationTo?: string[];
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onSaveAndLeave?: () => void;
  saveAndLeaveLabel?: string;
}

export function useUnsavedChangesPrompt({
  when,
  allowNavigationTo,
  title,
  description,
  confirmLabel,
  cancelLabel = "Seguir editando",
  onSaveAndLeave,
  saveAndLeaveLabel = "Guardar y salir",
}: UseUnsavedChangesPromptOptions) {
  const resolver = useBlocker({
    shouldBlockFn: ({ next }) => {
      if (!when) return false;
      if (allowNavigationTo?.some((path) => next.fullPath.startsWith(path))) {
        return false;
      }
      return true;
    },
    enableBeforeUnload: when,
    withResolver: true,
  });

  const promptedRef = useRef(false);

  useEffect(() => {
    if (resolver.status !== "blocked") {
      promptedRef.current = false;
      return;
    }
    if (promptedRef.current) return;
    promptedRef.current = true;

    if (onSaveAndLeave) {
      confirm({
        intent: "info",
        title: title ?? "¿Guardar antes de salir?",
        description:
          description ??
          "Podés guardar el borrador y retomar la planificación cuando quieras.",
        confirmLabel: saveAndLeaveLabel,
        onConfirm: () => {
          onSaveAndLeave();
          resolver.proceed?.();
        },
        tertiaryLabel: confirmLabel ?? "Salir sin guardar",
        onTertiary: () => resolver.proceed?.(),
        cancelLabel,
        onCancel: () => resolver.reset?.(),
      });
      return;
    }

    confirm({
      intent: "warning",
      title: title ?? "Cambios sin guardar",
      description:
        description ?? "Hay cambios sin guardar. Si sales ahora los perderás.",
      confirmLabel: confirmLabel ?? "Salir sin guardar",
      cancelLabel,
      onConfirm: () => resolver.proceed?.(),
      onCancel: () => resolver.reset?.(),
    });
  }, [
    resolver,
    resolver.status,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onSaveAndLeave,
    saveAndLeaveLabel,
  ]);
}
