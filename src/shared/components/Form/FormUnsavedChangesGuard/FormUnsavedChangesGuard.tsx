import { useFormContext, useFormState } from "react-hook-form";
import { useUnsavedChangesPrompt } from "@shared/hooks/useUnsavedChangesPrompt";

export interface FormUnsavedChangesGuardProps {
  active: boolean;
}

export function FormUnsavedChangesGuard({
  active,
}: FormUnsavedChangesGuardProps) {
  const { control } = useFormContext();
  const { isDirty } = useFormState({ control });
  useUnsavedChangesPrompt({ when: active && isDirty });
  return null;
}
