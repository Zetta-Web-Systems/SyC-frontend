interface BaseRiskFlag {
  name: string;
  affectedZones?: string[];
  medicalGuideline?: string;
}

export interface RiskFlag extends BaseRiskFlag {
  id: string;
  isActive: boolean;
}

export interface RegisterRiskFlag extends BaseRiskFlag {}

export interface UpdateRiskFlag extends Partial<BaseRiskFlag> {}
