import { cn } from "@shared/lib/cn";
import type { PopoverProps } from "@shared/ui";

export function getSideClasses(
  side: PopoverProps["side"],
  align: PopoverProps["align"],
): string {
  const verticalAlign = {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  };

  const horizontalAlign = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideMap: Record<string, string> = {
    top: cn("bottom-full mb-2", horizontalAlign[align ?? "start"]),
    bottom: cn("top-full mt-2", horizontalAlign[align ?? "start"]),
    left: cn("right-full mr-2", verticalAlign[align ?? "end"]),
    right: cn("left-full ml-2", verticalAlign[align ?? "end"]),
  };

  return sideMap[side ?? "right"];
}
