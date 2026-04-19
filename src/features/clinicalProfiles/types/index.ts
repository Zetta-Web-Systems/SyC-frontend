import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { RiskFlag } from "@features/riskFlags";

export interface CurrentStatus {
  id: string;
  painLevel: number;
  movementPhase?: string | null;
  bodyZone: BodyZone;
  side?: BodyLaterality | null;
}

export type MemberRiskFlagRiskFlag = Pick<
  RiskFlag,
  "id" | "name" | "affectedZones" | "isActive"
>;

export interface MemberRiskFlag {
  id: string;
  notes?: string | null;
  isActive: boolean;
  riskFlag: MemberRiskFlagRiskFlag;
  currentStatus: CurrentStatus[];
}

export interface ClinicalProfile {
  id: string;
  generalObservations?: string | null;
  memberRiskFlags: MemberRiskFlag[];
}

export interface ZoneStatusView {
  bodyZone: BodyZone;
  isPaired: boolean;
  isLegacy: boolean;
  leftStatusIndex?: number;
  rightStatusIndex?: number;
  singleStatusIndex?: number;
}
