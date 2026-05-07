import type { FieldArrayPath, Path } from "react-hook-form";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";

type CPPath = Path<ClinicalProfileFormSchema>;
type CPArrayPath = FieldArrayPath<ClinicalProfileFormSchema>;

export const memberRiskFlagPaths = {
  id: (i: number): CPPath => `memberRiskFlags.${i}.id` as CPPath,
  isActive: (i: number): CPPath => `memberRiskFlags.${i}.isActive` as CPPath,
  notes: (i: number): CPPath => `memberRiskFlags.${i}.notes` as CPPath,
  currentStatusArray: (i: number): CPArrayPath =>
    `memberRiskFlags.${i}.currentStatus` as CPArrayPath,
  currentStatusPath: (i: number): CPPath =>
    `memberRiskFlags.${i}.currentStatus` as CPPath,
  painLevel: (i: number, j: number): CPPath =>
    `memberRiskFlags.${i}.currentStatus.${j}.painLevel` as CPPath,
  movementPhase: (i: number, j: number): CPPath =>
    `memberRiskFlags.${i}.currentStatus.${j}.movementPhase` as CPPath,
  statusId: (i: number, j: number): CPPath =>
    `memberRiskFlags.${i}.currentStatus.${j}.id` as CPPath,
};
