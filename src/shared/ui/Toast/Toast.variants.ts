import { cva } from "class-variance-authority";

export const toastVariants = cva(
  "relative flex w-full sm:w-96 items-start gap-3 overflow-hidden rounded-lg border bg-white p-4 shadow-lg",
  {
    variants: {
      intent: {
        success: "border-x-success/20 border-t-success/20 bg-white",
        error: "border-x-error/20 border-t-error/20 bg-white",
        warning: "border-x-warning/20 border-t-warning/20 bg-white",
        info: "border-x-info/20 border-t-info/20 bg-white",
      },
    },
    defaultVariants: {
      intent: "info",
    },
  },
);

export const toastProgressVariants = cva(
  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:origin-left after:animate-[toast-progress] after:[animation-duration:var(--toast-duration,5000ms)] after:[animation-timing-function:linear] after:[animation-fill-mode:forwards]",
  {
    variants: {
      intent: {
        success: "after:bg-success",
        error: "after:bg-error",
        warning: "after:bg-warning",
        info: "after:bg-info",
      },
    },
    defaultVariants: {
      intent: "info",
    },
  },
);

export const toastIconVariants = cva("shrink-0", {
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
