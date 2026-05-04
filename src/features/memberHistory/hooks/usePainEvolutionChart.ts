import { useMemo, useState } from "react";
import {
  PAIN_EVOLUTION_DEFAULT_PERIOD,
  PAIN_EVOLUTION_PERIOD_OPTIONS,
  type PainEvolutionPeriodValue,
} from "../constants/painEvolution";
import { mockPainEvolutionRiskFlags } from "../data/painEvolution.mock";
import {
  buildChartRows,
  buildSeries,
  computeSeriesTrends,
  filterByFlags,
  filterByRange,
  flattenStatuses,
  getFlagOptions,
} from "../lib/painEvolution";
import type {
  FlagOption,
  PainChartRow,
  PainSeries,
  PainSeriesTrend,
} from "../types";
import { useMemberRiskFlagsHistoricalQuery } from "./useMemberRiskFlagsHistoricalQuery";

interface UsePainEvolutionChartResult {
  isLoading: boolean;
  isError: boolean;
  hasAnyData: boolean;
  hasDataInRange: boolean;
  period: PainEvolutionPeriodValue;
  setPeriod: (value: PainEvolutionPeriodValue) => void;
  hiddenSeries: Set<string>;
  toggleSeries: (key: string) => void;
  series: PainSeries[];
  visibleSeries: PainSeries[];
  trends: PainSeriesTrend[];
  visibleTrends: PainSeriesTrend[];
  rows: PainChartRow[];
  devMode: boolean;
  setDevMode: (value: boolean) => void;
  flagOptions: FlagOption[];
  selectedFlagIds: string[];
  setSelectedFlagIds: (ids: string[]) => void;
  includeInactive: boolean;
  setIncludeInactive: (value: boolean) => void;
}

function getPeriodDays(value: PainEvolutionPeriodValue): number | null {
  const option = PAIN_EVOLUTION_PERIOD_OPTIONS.find((o) => o.value === value);
  return option ? option.days : null;
}

export function usePainEvolutionChart(
  memberId: string | undefined,
): UsePainEvolutionChartResult {
  const [devMode, setDevMode] = useState(false);

  const {
    data: queryData,
    isLoading: queryLoading,
    isError: queryError,
  } = useMemberRiskFlagsHistoricalQuery(devMode ? undefined : memberId);

  const data = devMode ? mockPainEvolutionRiskFlags : queryData;
  const isLoading = devMode ? false : queryLoading;
  const isError = devMode ? false : queryError;

  const [period, setPeriod] = useState<PainEvolutionPeriodValue>(
    PAIN_EVOLUTION_DEFAULT_PERIOD,
  );
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [selectedFlagIds, setSelectedFlagIds] = useState<string[]>([]);
  const [includeInactive, setIncludeInactive] = useState(true);

  const allPoints = useMemo(() => flattenStatuses(data), [data]);

  const flagOptions = useMemo(() => getFlagOptions(data), [data]);

  const flagFilteredPoints = useMemo(
    () => filterByFlags(allPoints, selectedFlagIds, includeInactive),
    [allPoints, selectedFlagIds, includeInactive],
  );

  const filteredPoints = useMemo(
    () => filterByRange(flagFilteredPoints, getPeriodDays(period)),
    [flagFilteredPoints, period],
  );

  const series = useMemo(() => buildSeries(filteredPoints), [filteredPoints]);

  const visibleSeries = useMemo(
    () => series.filter((s) => !hiddenSeries.has(s.key)),
    [series, hiddenSeries],
  );

  const trends = useMemo(() => computeSeriesTrends(series), [series]);

  const visibleTrends = useMemo(
    () => trends.filter((t) => !hiddenSeries.has(t.key)),
    [trends, hiddenSeries],
  );

  const rows = useMemo(() => buildChartRows(visibleSeries), [visibleSeries]);

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return {
    isLoading,
    isError,
    hasAnyData: allPoints.length > 0,
    hasDataInRange: filteredPoints.length > 0,
    period,
    setPeriod,
    hiddenSeries,
    toggleSeries,
    series,
    visibleSeries,
    trends,
    visibleTrends,
    rows,
    devMode,
    setDevMode,
    flagOptions,
    selectedFlagIds,
    setSelectedFlagIds,
    includeInactive,
    setIncludeInactive,
  };
}
