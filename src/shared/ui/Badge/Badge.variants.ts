import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center font-medium leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        solid: "",
        dot: "bg-transparent",
      },
      intent: {
        success: "",
        warning: "",
        error: "",
        info: "",
        neutral: "",
      },
      size: {
        sm: "text-[10px] gap-1 rounded-full",
        md: "text-xs gap-1.5 rounded-full",
        lg: "text-sm gap-2.5 rounded-xl font-bold uppercase tracking-wide",
      },
    },
    compoundVariants: [
      { variant: "solid", size: "sm", class: "px-2 py-0.5" },
      { variant: "solid", size: "md", class: "px-2.5 py-1" },
      { variant: "solid", size: "lg", class: "px-4 py-2.5" },
      {
        variant: "solid",
        intent: "success",
        class: "bg-success/15 text-success",
      },
      {
        variant: "solid",
        intent: "warning",
        class: "bg-warning/15 text-warning",
      },
      { variant: "solid", intent: "error", class: "bg-error/15 text-error" },
      { variant: "solid", intent: "info", class: "bg-info/15 text-info" },
      {
        variant: "solid",
        intent: "neutral",
        class: "bg-neutral-100 text-neutral-500",
      },
      { variant: "dot", intent: "success", class: "text-success" },
      { variant: "dot", intent: "warning", class: "text-warning" },
      { variant: "dot", intent: "error", class: "text-error" },
      { variant: "dot", intent: "info", class: "text-info" },
      { variant: "dot", intent: "neutral", class: "text-neutral-500" },
    ],
    defaultVariants: {
      variant: "solid",
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

export const badgeDotVariants = cva("inline-block rounded-full shrink-0", {
  variants: {
    intent: {
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
      info: "bg-info",
      neutral: "bg-neutral-400",
    },
    size: {
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
  },
  defaultVariants: {
    intent: "neutral",
    size: "md",
  },
});
