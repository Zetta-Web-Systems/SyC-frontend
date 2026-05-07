import { Weight } from "lucide-react";
import { Card, Spinner, Switch } from "@shared/ui";
import { useWeightEvolutionChart } from "../../hooks/useWeightEvolutionChart";
import { WeightEvolutionLineChart } from "./WeightEvolutionLineChart";
import { WeightEvolutionPeriodSelector } from "./WeightEvolutionPeriodSelector";
import { WeightTrendSummary } from "./WeightTrendSummary";

interface WeightEvolutionChartProps {
  memberId: string;
}

export function WeightEvolutionChart({ memberId }: WeightEvolutionChartProps) {
  const {
    isLoading,
    isError,
    hasAnyData,
    hasDataInRange,
    period,
    setPeriod,
    rows,
    domain,
    trend,
    devMode,
    setDevMode,
  } = useWeightEvolutionChart(memberId);

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Weight size={16} aria-hidden="true" className="text-primary-500" />
            <h6 className="text-neutral-500">Evolución de peso</h6>
          </div>
          <label className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Datos demo</span>
            <Switch
              checked={devMode}
              onChange={(event) => setDevMode(event.target.checked)}
              size="sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <WeightEvolutionPeriodSelector value={period} onChange={setPeriod} />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        )}

        {isError && !isLoading && (
          <p
            role="alert"
            className="rounded-lg border border-error bg-error/5 p-3 text-sm text-error"
          >
            No se pudo cargar la evolución de peso.
          </p>
        )}

        {!isLoading && !isError && !hasAnyData && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            Aún no hay registros de peso para mostrar.
          </p>
        )}

        {!isLoading && !isError && hasAnyData && !hasDataInRange && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            No hay registros en el período seleccionado.
          </p>
        )}

        {!isLoading && !isError && hasDataInRange && (
          <>
            <WeightEvolutionLineChart rows={rows} domain={domain} />
            <WeightTrendSummary trend={trend} />
          </>
        )}
      </div>
    </Card>
  );
}

WeightEvolutionChart.displayName = "WeightEvolutionChart";
