import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import type { Side, Align } from "@shared/types/floating.types";
import { getSideClasses } from "@shared/utils/popover.utils";
import { dropdownPanelVariants } from "./DropdownPanel.variants";

export interface DropdownPanelProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof dropdownPanelVariants> {
  ref?: Ref<HTMLDivElement>;
  open: boolean;
  side?: Side;
  align?: Align;
  width?: "trigger" | "auto" | string;
  children: ReactNode;
}

export function DropdownPanel({
  ref,
  open,
  side = "bottom",
  align = "start",
  elevation,
  padding,
  width = "auto",
  className,
  children,
  ...props
}: DropdownPanelProps) {
  if (!open) return null;

  const widthClass =
    width === "trigger"
      ? "min-w-full"
      : width === "auto"
        ? "min-w-[180px]"
        : undefined;
  const widthStyle =
    typeof width === "string" && width !== "trigger" && width !== "auto"
      ? { width }
      : undefined;

  return (
    <div
      ref={ref}
      role="dialog"
      className={cn(
        dropdownPanelVariants({ elevation, padding }),
        getSideClasses(side, align),
        widthClass,
        className,
      )}
      style={widthStyle}
      {...props}
    >
      {children}
    </div>
  );
}

DropdownPanel.displayName = "DropdownPanel";
