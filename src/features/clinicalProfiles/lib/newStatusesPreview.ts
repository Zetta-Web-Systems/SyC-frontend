import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { RiskFlag } from "@features/riskFlags";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";
import type { ClinicalProfile } from "../types";

export interface NewStatusPreview {
  riskFlagName: string;
  bodyZone: BodyZone;
  side: BodyLaterality;
  painLevel: number;
}

export interface NewStatusesGroup {
  riskFlagName: string;
  items: NewStatusPreview[];
}

interface BuildPreviewParams {
  data: ClinicalProfileFormSchema;
  snapshot: ClinicalProfile | null;
  availableRiskFlags: RiskFlag[];
}

export function buildNewStatusesPreview({
  data,
  snapshot,
  availableRiskFlags,
}: BuildPreviewParams): NewStatusPreview[] {
  const snapshotFlagsById = new Map(
    (snapshot?.memberRiskFlags ?? []).map((mrf) => [mrf.id, mrf]),
  );
  const availableById = new Map(availableRiskFlags.map((r) => [r.id, r]));

  const preview: NewStatusPreview[] = [];

  for (const flag of data.memberRiskFlags) {
    const isNewFlag = !flag.id;
    const riskFlagName = isNewFlag
      ? (availableById.get(flag.riskFlagId)?.name ?? "Bandera de riesgo")
      : (snapshotFlagsById.get(flag.id as string)?.riskFlag.name ??
        "Bandera de riesgo");

    for (const status of flag.currentStatus) {
      const isNewStatus = isNewFlag || !status.id;
      if (!isNewStatus) continue;
      preview.push({
        riskFlagName,
        bodyZone: status.bodyZone,
        side: status.side,
        painLevel: status.painLevel,
      });
    }
  }

  return preview;
}

export function groupNewStatusesByRiskFlag(
  items: NewStatusPreview[],
): NewStatusesGroup[] {
  const map = new Map<string, NewStatusPreview[]>();
  for (const item of items) {
    const list = map.get(item.riskFlagName) ?? [];
    list.push(item);
    map.set(item.riskFlagName, list);
  }
  return Array.from(map.entries()).map(([riskFlagName, items]) => ({
    riskFlagName,
    items,
  }));
}
