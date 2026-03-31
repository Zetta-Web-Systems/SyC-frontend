import type { Ref } from "react";
import type { TextareaHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { textareaVariants } from "./Textarea.variants";

export interface TextareaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  ref?: Ref<HTMLTextAreaElement>;
  error?: boolean;
  errorMessage?: string;
}

export function Textarea({
  ref,
  error,
  errorMessage,
  className,
  id,
  disabled,
  ...props
}: TextareaProps) {
  const errorId = errorMessage ? `${id}-error` : undefined;
  const hasError = error ?? !!errorMessage;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <textarea
        ref={ref}
        id={id}
        disabled={disabled}
        className={cn(
          textareaVariants({ isError: hasError, isDisabled: disabled }),
          className,
        )}
        aria-invalid={hasError || undefined}
        aria-describedby={errorId}
        data-invalid={hasError ? "true" : undefined}
        {...props}
      />

      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

Textarea.displayName = "Textarea";
