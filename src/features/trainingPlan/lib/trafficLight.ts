import type {
  ClinicalProfile,
  CurrentStatus,
} from "@features/clinicalProfiles";
import type { Exercise, ExerciseLevel } from "@features/exercise";
import { PAIN_TOLERANCE_BY_LEVEL } from "../constants/trafficLight";

export type AffectedCurrentStatus = CurrentStatus & { riskFlagName?: string };

export function getPainTolerance(level: ExerciseLevel): number {
  return PAIN_TOLERANCE_BY_LEVEL[level] ?? 5;
}

export function getActiveCurrentStatuses(
  profile?: ClinicalProfile,
): AffectedCurrentStatus[] {
  return (profile?.memberRiskFlags ?? [])
    .filter((mrf) => mrf.isActive)
    .flatMap((mrf) =>
      mrf.currentStatus.map((cs) => ({
        ...cs,
        riskFlagName: mrf.riskFlag.name,
      })),
    );
}

export function getAffectedStatuses(
  exercise: Exercise,
  statuses: AffectedCurrentStatus[],
): AffectedCurrentStatus[] {
  const zones = exercise.affectedZones;
  if (!zones?.length) return [];
  const tol = getPainTolerance(exercise.exerciseLevel);
  return statuses.filter(
    (s) => zones.includes(s.bodyZone) && s.painLevel >= tol,
  );
}

export function computeIsYellow(
  exercise: Exercise,
  statuses: AffectedCurrentStatus[],
): boolean {
  return getAffectedStatuses(exercise, statuses).length > 0;
}
