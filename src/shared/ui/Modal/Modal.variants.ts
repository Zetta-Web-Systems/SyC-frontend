import { cva } from "class-variance-authority";

export const modalVariants = cva(
  "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 open:flex open:flex-col rounded-2xl bg-white p-0 shadow-xl max-h-[calc(100dvh-2rem)] overflow-hidden backdrop:bg-black/50 backdrop:backdrop-blur-sm",
  {
    variants: {
      size: {
        sm: "w-[calc(100%-2rem)] max-w-sm",
        md: "w-[calc(100%-2rem)] max-w-md",
        lg: "w-[calc(100%-2rem)] max-w-lg",
        form: "w-[calc(100%-2rem)] max-w-4xl",
        xl: "w-[calc(100%-2rem)] max-w-6xl",
        full: "w-[calc(100%-2rem)] max-w-[1200px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
