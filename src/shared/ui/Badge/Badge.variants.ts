import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center font-medium leading-none whitespace-nowrap",
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
        sm: "px-2 py-0.5 text-[10px] gap-1 rounded-full",
        md: "px-2.5 py-1 text-xs gap-1.5 rounded-full",
        lg: "px-4 py-2.5 text-sm gap-2.5 rounded-xl font-bold uppercase tracking-wide",
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "md",
    },
  },
);

export const badgeIconVariants = cva(
  "inline-flex items-center justify-center rounded-full shrink-0",
  {
    variants: {
      intent: {
        success: "bg-success text-white",
        warning: "bg-warning text-white",
        error: "bg-error text-white",
        info: "bg-info text-white",
        neutral: "bg-neutral-400 text-white",
      },
      size: {
        sm: "size-4 [&>svg]:size-2.5",
        md: "size-5 [&>svg]:size-3",
        lg: "size-7 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      intent: "neutral",
      size: "md",
    },
  },
);
