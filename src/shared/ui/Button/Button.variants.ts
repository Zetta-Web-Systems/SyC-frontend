import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98]",
  {
    variants: {
      variant: {
        solid: "border border-transparent",
        outline: "bg-transparent border",
        ghost: "bg-transparent border border-transparent",
      },
      intent: {
        primary: "",
        secondary: "",
        danger: "",
        neutral: "",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-8",
        icon: "h-10 w-10 justify-center px-0",
      },
      isLoading: {
        true: "opacity-80 cursor-wait pointer-events-none",
        false: "",
      },
      isDisabled: {
        true: "cursor-not-allowed",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      // SOLID
      {
        variant: "solid",
        intent: "primary",
        className:
          "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500",
      },
      {
        variant: "solid",
        intent: "secondary",
        className:
          "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 focus-visible:ring-secondary-500",
      },
      {
        variant: "solid",
        intent: "danger",
        className:
          "bg-error text-white hover:opacity-90 active:opacity-80 focus-visible:ring-error",
      },
      {
        variant: "solid",
        intent: "neutral",
        className:
          "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 focus-visible:ring-neutral-900",
      },

      // OUTLINE
      {
        variant: "outline",
        intent: "primary",
        className:
          "border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500",
      },
      {
        variant: "outline",
        intent: "secondary",
        className:
          "border-secondary-500 text-secondary-600 hover:bg-secondary-50 active:bg-secondary-100 focus-visible:ring-secondary-500",
      },
      {
        variant: "outline",
        intent: "danger",
        className:
          "border-error text-error hover:bg-red-50 active:bg-red-100 focus-visible:ring-error",
      },
      {
        variant: "outline",
        intent: "neutral",
        className:
          "border-neutral-300 text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-neutral-900",
      },

      // GHOST
      {
        variant: "ghost",
        intent: "primary",
        className:
          "text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500",
      },
      {
        variant: "ghost",
        intent: "secondary",
        className:
          "text-secondary-600 hover:bg-secondary-50 active:bg-secondary-100 focus-visible:ring-secondary-500",
      },
      {
        variant: "ghost",
        intent: "danger",
        className:
          "text-error hover:bg-red-50 active:bg-red-100 focus-visible:ring-error",
      },
      {
        variant: "ghost",
        intent: "neutral",
        className:
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 focus-visible:ring-neutral-900",
      },
    ],
    defaultVariants: {
      variant: "solid",
      intent: "primary",
      size: "md",
      isLoading: false,
      isDisabled: false,
    },
  },
);
