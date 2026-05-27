import { cva } from "class-variance-authority";

export const iconBoxVariants = cva(
  "inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        xs: "h-[22px] w-[22px]",
        sm: "h-7 w-7",
        md: "h-8 w-8",
        lg: "h-9 w-9",
        xl: "h-10 w-10",
      },
      shape: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
      tone: {
        subtle: "",
        soft: "",
        solid: "",
      },
      intent: {
        primary: "",
        secondary: "",
        neutral: "",
        success: "",
        warning: "",
        danger: "",
      },
    },
    compoundVariants: [
      {
        tone: "subtle",
        intent: "primary",
        className: "bg-primary-50 text-primary-600",
      },
      {
        tone: "subtle",
        intent: "secondary",
        className: "bg-secondary-50 text-secondary-600",
      },
      {
        tone: "subtle",
        intent: "neutral",
        className: "bg-neutral-50 text-neutral-500",
      },
      {
        tone: "subtle",
        intent: "success",
        className: "bg-success/15 text-success",
      },
      {
        tone: "subtle",
        intent: "warning",
        className: "bg-warning/20 text-warning",
      },
      {
        tone: "subtle",
        intent: "danger",
        className: "bg-error/15 text-error",
      },
      {
        tone: "soft",
        intent: "primary",
        className: "bg-primary-100 text-primary-700",
      },
      {
        tone: "soft",
        intent: "secondary",
        className: "bg-secondary-100 text-secondary-700",
      },
      {
        tone: "soft",
        intent: "neutral",
        className: "bg-neutral-100 text-neutral-600",
      },
      {
        tone: "soft",
        intent: "success",
        className: "bg-success/25 text-success",
      },
      {
        tone: "soft",
        intent: "warning",
        className: "bg-warning/25 text-warning",
      },
      {
        tone: "soft",
        intent: "danger",
        className: "bg-error/25 text-error",
      },
      {
        tone: "solid",
        intent: "primary",
        className: "bg-primary-500 text-white",
      },
      {
        tone: "solid",
        intent: "secondary",
        className: "bg-secondary-500 text-white",
      },
      {
        tone: "solid",
        intent: "neutral",
        className: "bg-neutral-900 text-white",
      },
      {
        tone: "solid",
        intent: "success",
        className: "bg-success text-white",
      },
      {
        tone: "solid",
        intent: "warning",
        className: "bg-warning text-white",
      },
      {
        tone: "solid",
        intent: "danger",
        className: "bg-error text-white",
      },
    ],
    defaultVariants: {
      size: "sm",
      shape: "md",
      tone: "soft",
      intent: "neutral",
    },
  },
);
