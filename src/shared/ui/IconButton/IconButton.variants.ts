import { cva } from "class-variance-authority";

export const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      size: {
        xs: "h-7 w-7",
        sm: "h-8 w-8",
        md: "h-9 w-9",
      },
      variant: {
        ghost: "bg-transparent",
        soft: "",
      },
      intent: {
        neutral: "",
        primary: "",
        danger: "",
        success: "",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        intent: "neutral",
        className:
          "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:ring-neutral-300 disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        intent: "primary",
        className:
          "text-primary-600 hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-primary-300 disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        intent: "danger",
        className:
          "text-neutral-400 hover:bg-error/10 hover:text-error focus-visible:ring-error/40 disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        intent: "success",
        className:
          "text-neutral-400 hover:bg-success/10 hover:text-success focus-visible:ring-success/40 disabled:hover:bg-transparent",
      },
      {
        variant: "soft",
        intent: "neutral",
        className:
          "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 focus-visible:ring-neutral-300",
      },
      {
        variant: "soft",
        intent: "primary",
        className:
          "bg-primary-50 text-primary-600 hover:bg-primary-100 focus-visible:ring-primary-300",
      },
      {
        variant: "soft",
        intent: "danger",
        className:
          "bg-error/10 text-error hover:bg-error/20 focus-visible:ring-error/40",
      },
      {
        variant: "soft",
        intent: "success",
        className:
          "bg-success/10 text-success hover:bg-success/20 focus-visible:ring-success/40",
      },
    ],
    defaultVariants: {
      size: "xs",
      variant: "ghost",
      intent: "neutral",
    },
  },
);
