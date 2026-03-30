import { cva } from "class-variance-authority";

export const filterDropdownTriggerVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-xl border font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 cursor-pointer active:scale-[0.98] h-10 px-4 text-sm",
  {
    variants: {
      isActive: {
        true: "border-primary-500 bg-primary-50 text-primary-700",
        false:
          "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);
