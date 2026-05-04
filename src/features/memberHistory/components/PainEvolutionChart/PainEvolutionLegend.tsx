import { cn } from "@shared/lib/cn";
import type { PainSeries } from "../../types";

interface PainEvolutionLegendProps {
  series: PainSeries[];
  hiddenSeries: Set<string>;
  onToggle: (key: string) => void;
}

export function PainEvolutionLegend({
  series,
  hiddenSeries,
  onToggle,
}: PainEvolutionLegendProps) {
  if (series.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
      {series.map((s) => {
        const isHidden = hiddenSeries.has(s.key);
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onToggle(s.key)}
            aria-pressed={!isHidden}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-opacity",
              "hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-primary-500",
              isHidden && "opacity-40 line-through",
            )}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

PainEvolutionLegend.displayName = "PainEvolutionLegend";
