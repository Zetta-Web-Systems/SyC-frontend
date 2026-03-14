import type { FieldValues, Path, FieldErrors } from "react-hook-form";
import { useFormContext, get } from "react-hook-form";

export interface FormMessageProps<TFields extends FieldValues> {
  name: Path<TFields>;
  id?: string;
}

export function FormMessage<TFields extends FieldValues>({
  name,
  id,
}: FormMessageProps<TFields>) {
  const {
    formState: { errors },
  } = useFormContext<TFields>();

  const error = get(errors as FieldErrors, name) as
    | { message?: string }
    | undefined;
  const message = error?.message;

  if (!message || typeof message !== "string") return null;

  return (
    <p id={id} role="alert" className="text-xs text-error">
      {message}
    </p>
  );
}

FormMessage.displayName = "FormMessage";
