import { cva } from "class-variance-authority";

export const pillVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap font-semibold leading-none transition-colors",
  {
    variants: {
      shape: {
        round: "rounded-full",
        squared: "rounded-lg",
      },
      size: {
        xs: "px-1.5 py-0.5 text-[10px]",
        sm: "px-2.5 py-0.5 text-[11px]",
        md: "px-2.5 py-1 text-[12.5px]",
      },
      tone: {
        soft: "",
        solid: "",
        outline: "border bg-white",
      },
      intent: {
        primary: "",
        secondary: "",
        neutral: "",
        success: "",
        warning: "",
        danger: "",
      },
      interactive: {
        true: "cursor-pointer transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        false: "",
      },
      uppercase: {
        true: "font-bold tracking-wider uppercase",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 active:scale-100",
        false: "",
      },
    },
    compoundVariants: [
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
        className: "bg-success/15 text-success",
      },
      {
        tone: "soft",
        intent: "warning",
        className: "bg-warning/15 text-warning",
      },
      {
        tone: "soft",
        intent: "danger",
        className: "bg-error/15 text-error",
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
      {
        tone: "outline",
        intent: "primary",
        className: "border-primary-500 text-primary-700",
      },
      {
        tone: "outline",
        intent: "secondary",
        className: "border-secondary-500 text-secondary-700",
      },
      {
        tone: "outline",
        intent: "neutral",
        className: "border-neutral-200 text-neutral-600",
      },
      {
        tone: "outline",
        intent: "success",
        className: "border-success text-success",
      },
      {
        tone: "outline",
        intent: "warning",
        className: "border-warning text-warning",
      },
      {
        tone: "outline",
        intent: "danger",
        className: "border-error text-error",
      },
      {
        tone: "outline",
        interactive: true,
        intent: "neutral",
        className: "hover:bg-neutral-50",
      },
      {
        tone: "outline",
        interactive: true,
        intent: "primary",
        className: "hover:bg-primary-50",
      },
      {
        tone: "outline",
        interactive: true,
        intent: "secondary",
        className: "hover:bg-secondary-50",
      },
      {
        tone: "soft",
        interactive: true,
        intent: "neutral",
        className: "hover:bg-neutral-200",
      },
      {
        tone: "soft",
        interactive: true,
        intent: "primary",
        className: "hover:bg-primary-200",
      },
      {
        tone: "soft",
        interactive: true,
        intent: "secondary",
        className: "hover:bg-secondary-200",
      },
      {
        interactive: true,
        intent: "primary",
        className: "focus-visible:ring-primary-500",
      },
      {
        interactive: true,
        intent: "secondary",
        className: "focus-visible:ring-secondary-500",
      },
      {
        interactive: true,
        intent: "neutral",
        className: "focus-visible:ring-neutral-500",
      },
      {
        interactive: true,
        intent: "danger",
        className: "focus-visible:ring-error",
      },
    ],
    defaultVariants: {
      shape: "round",
      size: "sm",
      tone: "soft",
      intent: "neutral",
      interactive: false,
      uppercase: false,
      disabled: false,
    },
  },
);
