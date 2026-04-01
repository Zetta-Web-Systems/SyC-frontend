import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { Label, AvatarUploader } from "@shared/ui";
import { FormMessage } from "@shared/components/Form/FormMessage/FormMessage";
import { cn } from "@shared/lib/cn";
import type { FieldPath, FieldValues } from "react-hook-form";

export interface FormImageProps<TFields extends FieldValues> {
  name: FieldPath<TFields>;
  label?: string;
  maxSizeMB?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  initialPreview?: string | null;
}

export function FormImage<TFields extends FieldValues>({
  name,
  label,
  maxSizeMB = 5,
  required,
  disabled,
  className,
  initialPreview,
}: FormImageProps<TFields>) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TFields>();

  const fieldId = useId();
  const fieldError = errors[name];
  const hasError = !!fieldError;
  const imageValue = watch(name) as File | null | undefined;

  const handleFileChange = (file: File | null) => {
    setValue(name, file as TFields[FieldPath<TFields>], { shouldValidate: true });
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      <AvatarUploader
        value={imageValue}
        initialPreview={initialPreview}
        onChange={handleFileChange}
        maxSizeMB={maxSizeMB}
        disabled={disabled}
      />

      {hasError && <FormMessage name={name as string} id={`${name}-error`} />}
    </div>
  );
}

FormImage.displayName = "FormImage";
