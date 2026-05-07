import { PAIRED_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";
import type { CurrentStatusFormSchema } from "../schemas/clinicalProfile.schema";

interface PairedSideValues {
  leftPain: number;
  rightPain: number;
  leftPhase: string | undefined;
  rightPhase: string | undefined;
}

export function arePairedSidesInSync({
  leftPain,
  rightPain,
  leftPhase,
  rightPhase,
}: PairedSideValues): boolean {
  return leftPain === rightPain && leftPhase === rightPhase;
}

export function findFirstZoneMissingSides(
  affectedZones: BodyZone[] | undefined,
  statuses: CurrentStatusFormSchema[],
): BodyZone | null {
  const pairedZones = (affectedZones ?? []).filter((z) =>
    PAIRED_BODY_ZONES.has(z),
  );
  for (const zone of pairedZones) {
    const hasAny = statuses.some((s) => s.bodyZone === zone);
    if (!hasAny) return zone;
  }
  return null;
}
