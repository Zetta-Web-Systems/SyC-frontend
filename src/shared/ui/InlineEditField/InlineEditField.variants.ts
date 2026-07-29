import { cva } from "class-variance-authority";

export const inlineEditShellVariants = cva(
  "items-center gap-1.5 border text-sm transition-all",
  {
    variants: {
      appearance: {
        chip: "inline-flex bg-white",
        seamless: "flex w-full bg-transparent",
      },
      shape: {
        rounded: "",
        pill: "",
      },
      editing: {
        true: "cursor-text",
        false: "cursor-pointer",
      },
      error: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        appearance: "chip",
        shape: "rounded",
        className: "rounded-lg px-2.5 py-1.5",
      },
      {
        appearance: "chip",
        shape: "pill",
        className: "rounded-full px-3 py-1.5",
      },
      {
        appearance: "seamless",
        shape: "rounded",
        className: "rounded-md px-1.5 py-0.5",
      },
      {
        appearance: "seamless",
        shape: "pill",
        className: "rounded-full px-2 py-0.5",
      },
      {
        appearance: "chip",
        editing: true,
        className: "border-primary-500 shadow-[0_0_0_3px_rgba(75,93,180,0.10)]",
      },
      {
        appearance: "chip",
        editing: false,
        className: "border-neutral-200 hover:border-neutral-300",
      },
      {
        appearance: "seamless",
        editing: true,
        className:
          "border-primary-500 bg-white shadow-[0_0_0_4px_rgba(75,93,180,0.10)]",
      },
      {
        appearance: "seamless",
        editing: false,
        className: "border-transparent hover:border-neutral-200",
      },
      { editing: false, error: true, className: "border-error" },
    ],
    defaultVariants: {
      appearance: "chip",
      shape: "rounded",
      editing: false,
      error: false,
    },
  },
);
