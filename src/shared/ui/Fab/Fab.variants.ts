import { cva } from "class-variance-authority";

export const fabVariants = cva(
  "z-30 inline-flex items-center justify-center font-semibold text-white shadow-[0_12px_30px_-8px_rgba(75,93,180,0.5)] transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
  {
    variants: {
      shape: {
        round: "h-14 w-14 rounded-full text-sm",
        extended: "h-14 gap-2 rounded-full px-5 text-sm",
      },
      intent: {
        primary: "bg-primary-500 hover:bg-primary-600",
        neutral: "bg-neutral-900 hover:bg-neutral-800",
      },
    },
    defaultVariants: {
      shape: "extended",
      intent: "primary",
    },
  },
);

export const fabToggleVariants = cva(
  "flex h-12 w-12 items-center justify-center rounded-full text-white opacity-90 shadow-[0_10px_24px_-10px_rgba(75,93,180,0.55)] transition-all hover:opacity-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
  {
    variants: {
      intent: {
        primary: "bg-primary-500 hover:bg-primary-600",
        neutral: "bg-neutral-900 hover:bg-neutral-800",
      },
    },
    defaultVariants: { intent: "primary" },
  },
);
