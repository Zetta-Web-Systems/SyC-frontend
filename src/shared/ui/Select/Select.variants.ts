import { cva } from "class-variance-authority";

export const selectVariants = cva(
  "w-full appearance-none rounded-xl border bg-white font-medium text-neutral-900 outline-none transition-all focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 pl-3 pr-8 text-xs",
        md: "h-10 pl-4 pr-10 text-sm",
        lg: "h-12 pl-4 pr-10 text-base",
      },
      iconPosition: {
        left: "pl-10 pr-3",
        right: "pr-10 pl-3",
      },
      isError: {
        true: "border-error bg-error/5 focus:border-error focus:ring-error/10",
        false:
          "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/10",
      },
      isDisabled: {
        true: "cursor-not-allowed",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      size: "md",
      isError: false,
      isDisabled: false,
    },
  },
);
