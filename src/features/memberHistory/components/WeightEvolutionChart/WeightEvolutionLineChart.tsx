import { lazy, Suspense } from "react";
import { Spinner } from "@shared/ui";
import type { WeightChartRow } from "../../types";

const WeightEvolutionLineChartImpl = lazy(() =>
  import("./WeightEvolutionLineChartImpl").then((m) => ({
    default: m.WeightEvolutionLineChartImpl,
  })),
);

interface WeightEvolutionLineChartProps {
  rows: WeightChartRow[];
  domain: [number, number];
}

export function WeightEvolutionLineChart(props: WeightEvolutionLineChartProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <WeightEvolutionLineChartImpl {...props} />
    </Suspense>
  );
}

WeightEvolutionLineChart.displayName = "WeightEvolutionLineChart";
