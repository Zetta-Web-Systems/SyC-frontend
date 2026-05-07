import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { Badge } from "@shared/ui";
import type { PainSeriesTrend, PainTrendDirection } from "../../types";

interface PainEvolutionTrendsProps {
  trends: PainSeriesTrend[];
}

type TrendIntent = "success" | "warning" | "error" | "info" | "neutral";

const TREND_LABEL: Record<PainTrendDirection, string> = {
  up: "Empeorando",
  down: "Mejorando",
  flat: "Estable",
};

const TREND_INTENT: Record<PainTrendDirection, TrendIntent> = {
  up: "error",
  down: "success",
  flat: "neutral",
};

const TREND_ICON: Record<PainTrendDirection, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: ArrowRight,
};

export function PainEvolutionTrends({ trends }: PainEvolutionTrendsProps) {
  if (trends.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600">
      {trends.map((trend) => {
        const Icon = TREND_ICON[trend.direction];
        return (
          <div key={trend.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: trend.color }}
            />
            <span>{trend.label}</span>
            <span className="text-sm font-semibold text-neutral-800">
              {trend.current}
              <span className="text-xs font-normal text-neutral-400">/10</span>
            </span>
            <Badge size="sm" intent={TREND_INTENT[trend.direction]}>
              <Icon size={10} aria-hidden="true" />
              {TREND_LABEL[trend.direction]}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

PainEvolutionTrends.displayName = "PainEvolutionTrends";
