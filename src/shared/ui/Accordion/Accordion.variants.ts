import { cva } from "class-variance-authority";

export const accordionVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "gap-2",
      bordered:
        "divide-y divide-neutral-200 rounded-xl border border-neutral-200 overflow-hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionItemVariants = cva("group", {
  variants: {
    variant: {
      default: "rounded-lg border border-neutral-200 bg-white",
      bordered: "bg-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionSummaryVariants = cva(
  "flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-800 transition-colors select-none [&::-webkit-details-marker]:hidden hover:bg-neutral-50",
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed opacity-60 hover:bg-transparent",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

export const accordionContentVariants = cva(
  "border-t border-neutral-200 px-3 py-3",
);
