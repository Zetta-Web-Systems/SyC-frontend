import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { Badge } from "@shared/ui";
import { WEIGHT_EVOLUTION_LINE_COLOR } from "../../constants/weightEvolution";
import type { WeightTrend, WeightTrendDirection } from "../../types";

interface WeightTrendSummaryProps {
  trend: WeightTrend;
}

type TrendIntent = "success" | "warning" | "error" | "info" | "neutral";

const TREND_LABEL: Record<WeightTrendDirection, string> = {
  up: "Subiendo",
  down: "Bajando",
  flat: "Estable",
};

const TREND_INTENT: Record<WeightTrendDirection, TrendIntent> = {
  up: "warning",
  down: "info",
  flat: "neutral",
};

const TREND_ICON: Record<WeightTrendDirection, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: ArrowRight,
};

function formatDelta(delta: number): string {
  if (delta === 0) return "0 kg";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta} kg`;
}

export function WeightTrendSummary({ trend }: WeightTrendSummaryProps) {
  const Icon = TREND_ICON[trend.direction];
  const hasData = trend.current !== null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-neutral-600">
      <span
        aria-hidden="true"
        className="size-2 rounded-full"
        style={{ backgroundColor: WEIGHT_EVOLUTION_LINE_COLOR }}
      />
      <span>Peso actual</span>
      <span className="text-sm font-semibold text-neutral-800">
        {hasData ? trend.current : "—"}
        <span className="text-xs font-normal text-neutral-400"> kg</span>
      </span>
      <Badge size="sm" intent={TREND_INTENT[trend.direction]}>
        <Icon size={10} aria-hidden="true" />
        {TREND_LABEL[trend.direction]}
        {hasData && trend.delta !== 0 && (
          <span>({formatDelta(trend.delta)})</span>
        )}
      </Badge>
    </div>
  );
}

WeightTrendSummary.displayName = "WeightTrendSummary";
