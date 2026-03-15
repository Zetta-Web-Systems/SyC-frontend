import { cva } from "class-variance-authority";

export const toastVariants = cva(
  "relative flex w-full sm:w-96 items-start gap-3 rounded-lg border bg-white p-4 shadow-lg",
  {
    variants: {
      intent: {
        success:
          "border-b-2 border-b-success border-x-green-100 border-t-green-100 bg-green-50",
        error:
          "border-b-2 border-b-error border-x-red-100 border-t-red-100 bg-red-50",
        warning:
          "border-b-2 border-b-warning border-x-amber-100 border-t-amber-100 bg-amber-50",
        info: "border-b-2 border-b-info border-x-blue-100 border-t-blue-100 bg-blue-50",
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
