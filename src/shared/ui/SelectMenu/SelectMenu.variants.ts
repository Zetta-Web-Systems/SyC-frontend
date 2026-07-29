import { cva } from "class-variance-authority";

export const selectMenuTriggerVariants = cva(
  "inline-flex items-center gap-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-500",
  {
    variants: {
      variant: {
        input:
          "w-full appearance-none justify-between rounded-xl border bg-white font-medium text-neutral-900 transition-all focus:ring-4",
        ghost: "rounded-md font-semibold",
        unstyled: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      isError: { true: "", false: "" },
      isDisabled: {
        true: "cursor-not-allowed opacity-50",
        false: "cursor-pointer",
      },
      isOpen: { true: "", false: "" },
    },
    compoundVariants: [
      { variant: "input", size: "sm", className: "h-8 px-3 text-xs" },
      { variant: "input", size: "md", className: "h-10 px-4 text-sm" },
      { variant: "input", size: "lg", className: "h-12 px-4 text-base" },
      { variant: "ghost", size: "sm", className: "px-1.5 py-0.5 text-[12px]" },
      { variant: "ghost", size: "md", className: "px-2 py-1 text-[13px]" },
      { variant: "ghost", size: "lg", className: "px-2.5 py-1.5 text-sm" },
      {
        variant: "input",
        isError: true,
        className:
          "border-error bg-error/5 focus:border-error focus:ring-error/10",
      },
      {
        variant: "input",
        isError: false,
        className:
          "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/10",
      },
      {
        variant: "ghost",
        isOpen: true,
        className: "bg-primary-500/10 text-primary-700",
      },
      {
        variant: "ghost",
        isOpen: false,
        className: "text-neutral-700 hover:bg-neutral-100",
      },
      {
        variant: "ghost",
        isError: true,
        isOpen: false,
        className: "text-error hover:bg-error/10",
      },
    ],
    defaultVariants: {
      variant: "input",
      size: "md",
      isError: false,
      isDisabled: false,
      isOpen: false,
    },
  },
);

export const selectMenuOptionVariants = cva(
  "flex w-full cursor-pointer items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
  {
    variants: {
      state: {
        default: "font-medium text-neutral-700 hover:bg-neutral-50",
        highlighted: "bg-neutral-100 font-medium text-neutral-900",
        selected: "bg-primary-500/10 font-semibold text-primary-700",
        "selected-highlighted":
          "bg-primary-500/20 font-semibold text-primary-700",
        disabled: "cursor-not-allowed font-medium text-neutral-300",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);
