import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@shared/ui/Button/Button";
import { cn } from "@shared/lib/cn";

export type ViewMode = "table" | "card";

export interface ViewToggleProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle = forwardRef<HTMLDivElement, ViewToggleProps>(
  ({ viewMode, onViewModeChange, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "hidden h-10 items-center gap-0.5 rounded-xl border border-neutral-300 bg-white px-1 md:flex",
        className,
      )}
      role="radiogroup"
      aria-label="Modo de vista"
      {...props}
    >
      <Button
        variant={viewMode === "table" ? "solid" : "ghost"}
        intent={viewMode === "table" ? "primary" : "neutral"}
        size="icon"
        role="radio"
        aria-checked={viewMode === "table"}
        aria-label="Vista tabla"
        onClick={() => onViewModeChange("table")}
        className="size-7"
      >
        <Table2 size={14} aria-hidden="true" />
      </Button>
      <Button
        variant={viewMode === "card" ? "solid" : "ghost"}
        intent={viewMode === "card" ? "primary" : "neutral"}
        size="icon"
        role="radio"
        aria-checked={viewMode === "card"}
        aria-label="Vista tarjetas"
        onClick={() => onViewModeChange("card")}
        className="size-7"
      >
        <LayoutGrid size={14} aria-hidden="true" />
      </Button>
    </div>
  ),
);
ViewToggle.displayName = "ViewToggle";
