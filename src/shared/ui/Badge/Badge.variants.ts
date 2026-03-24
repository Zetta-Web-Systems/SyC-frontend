import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
  {
    variants: {
      intent: {
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        error: "bg-error/15 text-error",
        info: "bg-info/15 text-info",
        neutral: "bg-neutral-100 text-neutral-500",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "md",
    },
  },
);
