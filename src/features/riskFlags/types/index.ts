import type { BodyZone } from "../constants";

interface BaseRiskFlag {
  name: string;
  affectedZones?: BodyZone[];
  medicalGuideline?: string;
}

export interface RiskFlag extends BaseRiskFlag {
  id: string;
  isActive: boolean;
}

export interface RegisterRiskFlag extends BaseRiskFlag {}

export interface UpdateRiskFlag extends Partial<BaseRiskFlag> {}
