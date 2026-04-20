import { cva } from "class-variance-authority";

export const switchTrackVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
      },
      checked: {
        true: "bg-primary-600",
        false: "bg-neutral-400",
      },
      error: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [{ checked: true, error: true, class: "bg-error" }],
    defaultVariants: {
      size: "md",
      checked: false,
      error: false,
    },
  },
);

export const switchThumbVariants = cva(
  "pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
      },
      checked: {
        true: "",
        false: "translate-x-0",
      },
    },
    compoundVariants: [
      { size: "sm", checked: true, class: "translate-x-4" },
      { size: "md", checked: true, class: "translate-x-5" },
    ],
    defaultVariants: {
      size: "md",
      checked: false,
    },
  },
);
