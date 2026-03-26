import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4 resize-y min-h-24 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      isError: {
        true: "border-error bg-error/5 focus:border-error focus:ring-error/10",
        false:
          "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/10",
      },
      isDisabled: {
        true: "cursor-not-allowed",
        false: "cursor-text",
      },
    },
    defaultVariants: {
      isError: false,
      isDisabled: false,
    },
  },
);
