import { useMemo, useState } from "react";
import {
  WEIGHT_EVOLUTION_DEFAULT_PERIOD,
  WEIGHT_EVOLUTION_PERIOD_OPTIONS,
  WEIGHT_EVOLUTION_Y_PADDING,
  type WeightEvolutionPeriodValue,
} from "../constants/weightEvolution";
import { mockWeightEvolution } from "../data/weightEvolution.mock";
import {
  buildWeightRows,
  computeWeightDomain,
  computeWeightTrend,
  filterWeightByRange,
} from "../lib/weightEvolution";
import type { WeightChartRow, WeightTrend } from "../types";
import { useMemberWeightHistoricalQuery } from "./useMemberWeightHistoricalQuery";

interface UseWeightEvolutionChartResult {
  isLoading: boolean;
  isError: boolean;
  hasAnyData: boolean;
  hasDataInRange: boolean;
  period: WeightEvolutionPeriodValue;
  setPeriod: (value: WeightEvolutionPeriodValue) => void;
  rows: WeightChartRow[];
  domain: [number, number];
  trend: WeightTrend;
  devMode: boolean;
  setDevMode: (value: boolean) => void;
}

function getPeriodDays(value: WeightEvolutionPeriodValue): number | null {
  const option = WEIGHT_EVOLUTION_PERIOD_OPTIONS.find((o) => o.value === value);
  return option ? option.days : null;
}

export function useWeightEvolutionChart(
  memberId: string | undefined,
): UseWeightEvolutionChartResult {
  const [devMode, setDevMode] = useState(false);

  const {
    data: queryData,
    isLoading: queryLoading,
    isError: queryError,
  } = useMemberWeightHistoricalQuery(devMode ? undefined : memberId);

  const data = devMode ? mockWeightEvolution : queryData;
  const isLoading = devMode ? false : queryLoading;
  const isError = devMode ? false : queryError;

  const [period, setPeriod] = useState<WeightEvolutionPeriodValue>(
    WEIGHT_EVOLUTION_DEFAULT_PERIOD,
  );

  const allPoints = useMemo(() => data ?? [], [data]);

  const filteredPoints = useMemo(
    () => filterWeightByRange(allPoints, getPeriodDays(period)),
    [allPoints, period],
  );

  const rows = useMemo(() => buildWeightRows(filteredPoints), [filteredPoints]);

  const domain = useMemo(
    () => computeWeightDomain(rows, WEIGHT_EVOLUTION_Y_PADDING),
    [rows],
  );

  const trend = useMemo(() => computeWeightTrend(rows), [rows]);

  return {
    isLoading,
    isError,
    hasAnyData: allPoints.length > 0,
    hasDataInRange: rows.length > 0,
    period,
    setPeriod,
    rows,
    domain,
    trend,
    devMode,
    setDevMode,
  };
}
