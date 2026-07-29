import { cva } from "class-variance-authority";

export const cardVariants = cva("", {
  variants: {
    surface: {
      plain: "",
      panel: "rounded-xl border border-neutral-200 bg-white",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    },
    interactive: {
      true: "cursor-pointer transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
      false: "",
    },
    selected: {
      true: "border-primary-300 ring-2 ring-primary-500",
      false: "",
    },
  },
  compoundVariants: [
    {
      surface: "panel",
      interactive: true,
      selected: false,
      class: "hover:border-neutral-300",
    },
  ],
  defaultVariants: {
    surface: "plain",
    padding: "none",
    interactive: false,
    selected: false,
  },
});
