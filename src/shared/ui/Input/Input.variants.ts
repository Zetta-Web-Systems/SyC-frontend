import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "w-full rounded-xl border bg-white font-medium text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-4 text-base",
      },
      isError: {
        true: "border-error bg-error/5 text-neutral-900 focus:border-error focus:ring-error/10",
        false: "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/10",
      },
      isDisabled: {
        true: "cursor-not-allowed",
        false: "cursor-text",
      },
    },
    defaultVariants: {
      size: "md",
      isError: false,
      isDisabled: false,
    },
  },
);
