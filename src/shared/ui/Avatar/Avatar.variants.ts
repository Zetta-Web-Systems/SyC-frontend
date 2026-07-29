import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-14 w-14 text-xl",
        profile: "h-20 w-20 text-2xl",
      },
      color: {
        primary: "bg-primary-100 text-primary-700",
        secondary: "bg-secondary-100 text-secondary-700",
        neutral: "bg-neutral-200 text-neutral-700",
        violet: "bg-violet/15 text-violet",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  },
);
