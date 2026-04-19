import { useCallback, useId } from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label, AvatarUploader } from "@shared/ui";
import { FormMessage } from "@shared/components/Form/FormMessage/FormMessage";
import { cn } from "@shared/lib/cn";
import { confirm } from "@shared/stores/confirm.store";

export interface FormImageProps<TFields extends FieldValues> {
  name: FieldPath<TFields>;
  label?: string;
  maxSizeMB?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  initialPreview?: string | null;
  deleteFieldName?: FieldPath<TFields>;
  deleteFieldTitle?: string;
  deleteFieldDescription?: string;
}

export function FormImage<TFields extends FieldValues>({
  name,
  label,
  maxSizeMB = 5,
  required,
  disabled,
  className,
  initialPreview,
  deleteFieldName,
  deleteFieldTitle = "Eliminar imagen",
  deleteFieldDescription = "¿Estás seguro que deseas eliminar la imagen?",
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

  const isDeleted = deleteFieldName
    ? (watch(deleteFieldName) as boolean | undefined) === true
    : false;

  const handleFileChange = useCallback(
    (file: File | null) => {
      setValue(name, file as TFields[FieldPath<TFields>], {
        shouldValidate: true,
        shouldDirty: true,
      });

      if (file && deleteFieldName) {
        setValue(deleteFieldName, undefined as TFields[FieldPath<TFields>], {
          shouldDirty: false,
        });
      }
    },
    [name, deleteFieldName, setValue],
  );

  const handleRemove = useCallback(() => {
    if (!deleteFieldName) return;

    confirm({
      intent: "danger",
      title: deleteFieldTitle,
      description: deleteFieldDescription,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        setValue(name, null as TFields[FieldPath<TFields>], {
          shouldDirty: true,
        });
        setValue(deleteFieldName, true as TFields[FieldPath<TFields>], {
          shouldDirty: true,
        });
      },
    });
  }, [name, deleteFieldName, deleteFieldTitle, deleteFieldDescription, setValue]);

  const handleRestore = useCallback(() => {
    if (!deleteFieldName) return;

    setValue(deleteFieldName, undefined as TFields[FieldPath<TFields>], {
      shouldDirty: false,
    });
  }, [deleteFieldName, setValue]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      <AvatarUploader
        value={imageValue}
        initialPreview={isDeleted ? null : initialPreview}
        onChange={handleFileChange}
        onRemove={deleteFieldName ? handleRemove : undefined}
        onRestore={isDeleted && initialPreview ? handleRestore : undefined}
        maxSizeMB={maxSizeMB}
        disabled={disabled}
      />

      {hasError && <FormMessage name={name as string} id={`${name}-error`} />}
    </div>
  );
}

FormImage.displayName = "FormImage";
