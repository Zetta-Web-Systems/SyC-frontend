import type { ReactElement } from "react";
import type { FieldValues, Path, ControllerRenderProps } from "react-hook-form";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@shared/ui/Label/Label";
import { cn } from "@shared/lib/cn";

export interface FieldRenderProps extends Pick<
  ControllerRenderProps,
  "ref" | "name" | "value" | "onBlur" | "onChange"
> {
  id: string;
  disabled?: boolean;
  error: boolean;
  errorMessage?: string;
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
  const { control } = useFormContext<TFields>();
  const fieldId = `field-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message;

        const content = (
          <>
            {label && (
              <Label htmlFor={fieldId} required={required}>
                {label}
              </Label>
            )}
            {children({
              ref: field.ref,
              name: field.name,
              value: field.value,
              onChange: field.onChange,
              onBlur: field.onBlur,
              id: fieldId,
              disabled,
              error: !!fieldState.error,
              errorMessage,
            })}
          </>
        );

        if (!label && !className) return content;

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            {content}
          </div>
        );
      }}
    />
  );
}

FormField.displayName = "FormField";
