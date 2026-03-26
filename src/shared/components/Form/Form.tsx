import type { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";
import type { $ZodType } from "zod/v4/core";
import { zodResolver } from "@hookform/resolvers/zod";

export interface FormProps<TFields extends FieldValues> {
  schema: $ZodType<TFields, TFields>;
  className?: string;
  id?: string;
  onSubmit: SubmitHandler<TFields>;
  defaultValues?: DefaultValues<TFields>;
  children: ReactNode | ((form: UseFormReturn<TFields>) => ReactNode);
}

export function Form<TFields extends FieldValues>({
  schema,
  className,
  id,
  onSubmit,
  defaultValues,
  children,
}: FormProps<TFields>) {
  const form = useForm<TFields>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues,
    shouldFocusError: true,
  });

  return (
    <FormProvider {...form}>
      <form
        id={id}
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {typeof children === "function" ? children(form) : children}
      </form>
    </FormProvider>
  );
}

Form.displayName = "Form";
