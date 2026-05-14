import { useId } from "react";
import { Activity } from "lucide-react";
import { Card, Spinner, Switch } from "@shared/ui";
import { usePainEvolutionChart } from "../../hooks/usePainEvolutionChart";
import { PainEvolutionFilters } from "./PainEvolutionFilters";
import { PainEvolutionLegend } from "./PainEvolutionLegend";
import { PainEvolutionLineChart } from "./PainEvolutionLineChart";
import { PainEvolutionTrends } from "./PainEvolutionTrends";

interface PainEvolutionChartProps {
  memberId: string;
}

export function PainEvolutionChart({ memberId }: PainEvolutionChartProps) {
  const {
    isLoading,
    isError,
    hasAnyData,
    hasDataInRange,
    period,
    setPeriod,
    hiddenSeries,
    toggleSeries,
    series,
    visibleSeries,
    visibleTrends,
    rows,
    devMode,
    setDevMode,
    flagOptions,
    selectedFlagIds,
    setSelectedFlagIds,
    includeInactive,
    setIncludeInactive,
  } = usePainEvolutionChart(memberId);
  const devModeId = useId();

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity
              size={16}
              aria-hidden="true"
              className="text-primary-500"
            />
            <h6 className="text-neutral-500">Evolución de dolor</h6>
          </div>
          <label
            htmlFor={devModeId}
            className="flex items-center gap-2 text-xs text-neutral-500"
          >
            <span>Datos demo</span>
            <Switch
              id={devModeId}
              checked={devMode}
              onChange={(event) => setDevMode(event.target.checked)}
              size="sm"
            />
          </label>
        </div>

        <PainEvolutionFilters
          period={period}
          onPeriodChange={setPeriod}
          flagOptions={flagOptions}
          selectedFlagIds={selectedFlagIds}
          onSelectedFlagIdsChange={setSelectedFlagIds}
          includeInactive={includeInactive}
          onIncludeInactiveChange={setIncludeInactive}
        />

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
            No se pudo cargar la evolución de dolor.
          </p>
        )}

        {!isLoading && !isError && !hasAnyData && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            Aún no hay registros de dolor para mostrar.
          </p>
        )}

        {!isLoading && !isError && hasAnyData && !hasDataInRange && (
          <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            No hay registros en el período seleccionado.
          </p>
        )}

        {!isLoading && !isError && hasDataInRange && (
          <>
            <PainEvolutionLegend
              series={series}
              hiddenSeries={hiddenSeries}
              onToggle={toggleSeries}
            />
            <PainEvolutionLineChart rows={rows} series={visibleSeries} />
            <PainEvolutionTrends trends={visibleTrends} />
          </>
        )}
      </div>
    </Card>
  );
}

PainEvolutionChart.displayName = "PainEvolutionChart";
