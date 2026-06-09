import { useFormContext, useFormState } from "react-hook-form";
import { useUnsavedChangesPrompt } from "@shared/hooks/useUnsavedChangesPrompt";

export interface FormUnsavedChangesGuardProps {
  active: boolean;
  allowNavigationTo?: string[];
  onSaveAndLeave?: () => void;
}

export function FormUnsavedChangesGuard({
  active,
  allowNavigationTo,
  onSaveAndLeave,
}: FormUnsavedChangesGuardProps) {
  const { control } = useFormContext();
  const { isDirty } = useFormState({ control });
  useUnsavedChangesPrompt({
    when: active && isDirty,
    allowNavigationTo,
    onSaveAndLeave,
  });
  return null;
}
