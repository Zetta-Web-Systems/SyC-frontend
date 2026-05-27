import { cva } from "class-variance-authority";

export const inlineEditShellVariants = cva(
  "inline-flex items-center gap-1.5 border bg-white text-[12.5px] transition-all",
  {
    variants: {
      shape: {
        rounded: "rounded-lg px-2.5 py-1",
        pill: "rounded-full px-3 py-1",
      },
      editing: {
        true: "border-primary-500 shadow-[0_0_0_3px_rgba(75,93,180,0.10)] cursor-text",
        false: "border-neutral-200 hover:border-neutral-300 cursor-pointer",
      },
      error: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { editing: false, error: true, className: "border-error" },
    ],
    defaultVariants: {
      shape: "rounded",
      editing: false,
      error: false,
    },
  },
);
