import { useFormContext, useFormState } from "react-hook-form";
import { useUnsavedChangesPrompt } from "@shared/hooks/useUnsavedChangesPrompt";

export interface FormUnsavedChangesGuardProps {
  active: boolean;
  allowNavigationTo?: string[];
}

export function FormUnsavedChangesGuard({
  active,
  allowNavigationTo,
}: FormUnsavedChangesGuardProps) {
  const { control } = useFormContext();
  const { isDirty } = useFormState({ control });
  useUnsavedChangesPrompt({ when: active && isDirty, allowNavigationTo });
  return null;
}
