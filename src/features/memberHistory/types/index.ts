import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";

export interface PainPoint {
  bodyZone: BodyZone;
  side: BodyLaterality;
  painLevel: number;
  createdAt: string;
  flagId: string;
  flagName: string;
  flagIsActive: boolean;
}

export interface FlagOption {
  id: string;
  name: string;
  isActive: boolean;
}

export interface PainSeries {
  key: string;
  label: string;
  color: string;
  points: PainPoint[];
}

export type PainTrendDirection = "up" | "down" | "flat";

export interface PainSeriesTrend {
  key: string;
  label: string;
  color: string;
  current: number;
  delta: number;
  direction: PainTrendDirection;
}

export interface PainChartRow {
  timestamp: number;
  [key: string]: number | boolean | undefined;
}

export interface WeightHistoricalPoint {
  id: string;
  weight: number;
  measuredAt: string;
}

export interface WeightChartRow {
  timestamp: number;
  weight: number;
}

export type WeightTrendDirection = "up" | "down" | "flat";

export interface WeightTrend {
  current: number | null;
  initial: number | null;
  delta: number;
  direction: WeightTrendDirection;
}
