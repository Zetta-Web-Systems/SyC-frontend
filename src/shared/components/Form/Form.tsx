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
import { getApiErrorMessage } from "@shared/api/apiError";

interface MutationLike {
  isError: boolean;
  error: unknown;
}

export interface FormProps<TFields extends FieldValues> {
  schema: $ZodType<TFields, TFields>;
  mutation?: MutationLike;
  className?: string;
  id?: string;
  onSubmit: SubmitHandler<TFields>;
  defaultValues?: DefaultValues<TFields>;
  children: ReactNode | ((form: UseFormReturn<TFields>) => ReactNode);
}

export function Form<TFields extends FieldValues>({
  schema,
  mutation,
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
        {mutation?.isError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error"
          >
            {getApiErrorMessage(mutation.error)}
          </div>
        )}
        {typeof children === "function" ? children(form) : children}
      </form>
    </FormProvider>
  );
}

Form.displayName = "Form";
