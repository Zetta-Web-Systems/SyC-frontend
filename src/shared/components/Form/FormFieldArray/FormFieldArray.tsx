import type { ReactElement } from "react";
import type {
  FieldValues,
  FieldArrayPath,
  UseFieldArrayReturn,
} from "react-hook-form";
import { useFormContext, useFieldArray } from "react-hook-form";

export interface FormFieldArrayProps<
  TFields extends FieldValues,
  TName extends FieldArrayPath<TFields>,
> {
  name: TName;
  children: (array: UseFieldArrayReturn<TFields, TName>) => ReactElement;
}

export function FormFieldArray<
  TFields extends FieldValues,
  TName extends FieldArrayPath<TFields> = FieldArrayPath<TFields>,
>({ name, children }: FormFieldArrayProps<TFields, TName>) {
  const { control } = useFormContext<TFields>();
  const array = useFieldArray<TFields, TName>({ name, control });

  return children(array);
}

FormFieldArray.displayName = "FormFieldArray";
