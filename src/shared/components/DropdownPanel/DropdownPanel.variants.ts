import { cva } from "class-variance-authority";

export const dropdownPanelVariants = cva(
  "absolute z-40 overflow-hidden bg-white",
  {
    variants: {
      elevation: {
        sm: "rounded-xl shadow-[0_8px_24px_-8px_rgba(15,17,30,0.18),0_0_0_1px_rgba(15,17,30,0.06)]",
        md: "rounded-xl shadow-[0_14px_36px_-10px_rgba(15,17,30,0.24),0_0_0_1px_rgba(15,17,30,0.06)]",
        lg: "rounded-2xl shadow-[0_22px_60px_-14px_rgba(15,17,30,0.32),0_0_0_1px_rgba(15,17,30,0.06)]",
      },
      padding: {
        none: "",
        sm: "p-1",
        md: "p-2",
      },
    },
    defaultVariants: {
      elevation: "md",
      padding: "none",
    },
  },
);
