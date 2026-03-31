import { cva } from "class-variance-authority";

export const spinnerVariants = cva(
  "animate-spin rounded-full border-current border-r-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
