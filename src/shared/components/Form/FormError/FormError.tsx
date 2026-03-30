import { getApiErrorMessage } from "@shared/api/apiError";
import type { MutationLike } from "@shared/types/mutations.types";

export interface FormErrorProps {
  mutation?: MutationLike;
}

export function FormError({ mutation }: FormErrorProps) {
  if (!mutation?.isError) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-error/25 bg-error/10 px-4 py-3 text-center text-sm text-error"
    >
      {getApiErrorMessage(mutation.error)}
    </p>
  );
}

FormError.displayName = "FormError";
