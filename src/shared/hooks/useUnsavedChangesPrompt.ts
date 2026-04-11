import { useEffect, useRef } from "react";
import { useBlocker } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";

interface UseUnsavedChangesPromptOptions {
  when: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function useUnsavedChangesPrompt({
  when,
  title = "Cambios sin guardar",
  description = "Hay cambios sin guardar. Si sales ahora los perderás.",
  confirmLabel = "Salir sin guardar",
  cancelLabel = "Seguir editando",
}: UseUnsavedChangesPromptOptions) {
  const resolver = useBlocker({
    shouldBlockFn: () => when,
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

    confirm({
      intent: "warning",
      title,
      description,
      confirmLabel,
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
  ]);
}
