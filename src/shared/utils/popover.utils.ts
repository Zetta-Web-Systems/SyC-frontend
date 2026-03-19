import { cn } from "@shared/lib/cn";
import type { PopoverProps } from "@shared/ui";

export function getSideClasses(
  side: PopoverProps["side"],
  align: PopoverProps["align"],
): string {
  const alignClasses = {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  };

  const sideMap: Record<string, string> = {
    top: "bottom-full left-0 mb-2",
    bottom: "top-full left-0 mt-2",
    left: cn("right-full mr-2", alignClasses[align ?? "end"]),
    right: cn("left-full ml-2", alignClasses[align ?? "end"]),
  };

  return sideMap[side ?? "right"];
}
