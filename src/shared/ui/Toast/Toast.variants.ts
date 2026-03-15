import { cva } from "class-variance-authority";

export const toastVariants = cva(
  "relative flex w-full sm:w-96 items-start gap-3 rounded-lg border bg-white p-4 shadow-lg",
  {
    variants: {
      intent: {
        success:
          "border-b-2 border-b-success border-x-success/20 border-t-success/20 bg-success/10",
        error:
          "border-b-2 border-b-error border-x-error/20 border-t-error/20 bg-error/10",
        warning:
          "border-b-2 border-b-warning border-x-warning/20 border-t-warning/20 bg-warning/10",
        info: "border-b-2 border-b-info border-x-info/20 border-t-info/20 bg-info/10",
      },
    },
    defaultVariants: {
      intent: "info",
    },
  },
);

export const toastIconVariants = cva("mt-0.5 shrink-0", {
  variants: {
    intent: {
      success: "text-success",
      error: "text-error",
      warning: "text-warning",
      info: "text-info",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});
