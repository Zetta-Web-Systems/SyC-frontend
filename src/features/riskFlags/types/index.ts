import type { BodyZone } from "@shared/types/bodyZone.types";

interface BaseRiskFlag {
  name: string;
  affectedZones?: BodyZone[];
  medicalGuideline?: string;
}

export interface RiskFlag extends BaseRiskFlag {
  id: string;
  isActive: boolean;
}

export type RegisterRiskFlag = BaseRiskFlag;

export type UpdateRiskFlag = Partial<BaseRiskFlag>;

export type { AffectedGroup } from "@shared/types/bodyZone.types";
