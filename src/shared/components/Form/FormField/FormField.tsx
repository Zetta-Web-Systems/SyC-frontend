import type { ReactElement } from "react";
import type { FieldValues, Path, ChangeHandler } from "react-hook-form";
import { useFormContext, get } from "react-hook-form";
import { Label } from "@shared/ui/Label/Label";
import { FormMessage } from "@shared/components/Form/FormMessage/FormMessage";
import { cn } from "@shared/lib/cn";

export interface FieldRenderProps {
  ref: (instance: HTMLElement | null) => void;
  name: string;
  onChange: ChangeHandler;
  onBlur: ChangeHandler;
  id: string;
  disabled?: boolean;
  error: boolean;
  "aria-describedby"?: string;
}

export interface FormFieldProps<TFields extends FieldValues> {
  name: Path<TFields>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: (field: FieldRenderProps) => ReactElement;
}

export function FormField<TFields extends FieldValues>({
  name,
  label,
  required,
  disabled,
  className,
  children,
}: FormFieldProps<TFields>) {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<TFields>();

  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hasError = !!get(errors, name);

  const registration = register(name, { disabled });

  const handleChange: ChangeHandler = (event) => {
    clearErrors(name);
    return registration.onChange(event);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      {children({
        ref: registration.ref,
        name,
        onChange: handleChange,
        onBlur: registration.onBlur,
        id: fieldId,
        disabled,
        error: hasError,
        "aria-describedby": hasError ? errorId : undefined,
      })}

      <FormMessage name={name} id={errorId} />
    </div>
  );
}

FormField.displayName = "FormField";
