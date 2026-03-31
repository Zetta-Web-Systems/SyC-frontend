import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { spinnerVariants } from "./Spinner.variants";

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

export function Spinner({ size, label, className }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        role="status"
        aria-label={label ?? "Cargando"}
        className={cn("text-primary-500", spinnerVariants({ size }), className)}
      />
      {label && <span className="text-sm text-neutral-500">{label}</span>}
      <span className="sr-only">{label ?? "Cargando"}</span>
    </div>
  );
}

Spinner.displayName = "Spinner";
