import { lazy, Suspense } from "react";
import { Spinner } from "@shared/ui";
import type { PainChartRow, PainSeries } from "../../types";

const PainEvolutionLineChartImpl = lazy(() =>
  import("./PainEvolutionLineChartImpl").then((m) => ({
    default: m.PainEvolutionLineChartImpl,
  })),
);

interface PainEvolutionLineChartProps {
  rows: PainChartRow[];
  series: PainSeries[];
}

export function PainEvolutionLineChart(props: PainEvolutionLineChartProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <PainEvolutionLineChartImpl {...props} />
    </Suspense>
  );
}

PainEvolutionLineChart.displayName = "PainEvolutionLineChart";
