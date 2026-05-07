import type { ReactElement } from "react";
import type { FieldValues, Path, RefCallBack } from "react-hook-form";
import { useFormContext, useController } from "react-hook-form";
import { Label } from "@shared/ui";
import { FormMessage } from "@shared/components/Form/FormMessage/FormMessage";
import { cn } from "@shared/lib/cn";

export interface FieldRenderProps {
  ref: RefCallBack;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- value: any es el valor por defecto que RHF asigna, no hay otra que dejarlo así
  value: any;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
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
  const { control, clearErrors } = useFormContext<TFields>();

  const { field, fieldState } = useController({ name, control, disabled });

  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hasError = !!fieldState.error;

  const handleChange = (...event: unknown[]) => {
    clearErrors(name);
    field.onChange(...event);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      {children({
        ref: field.ref,
        name: field.name,
        value: field.value ?? "",
        onChange: handleChange,
        onBlur: field.onBlur,
        id: fieldId,
        disabled: field.disabled,
        error: hasError,
        "aria-describedby": hasError ? errorId : undefined,
      })}

      <FormMessage name={name} id={errorId} />
    </div>
  );
}

FormField.displayName = "FormField";
