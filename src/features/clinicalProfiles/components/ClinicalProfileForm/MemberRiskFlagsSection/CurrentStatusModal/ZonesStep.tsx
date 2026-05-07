import type { Path } from "react-hook-form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormMessage } from "@shared/components/Form";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { useInitializeZoneStatuses } from "../../../../hooks/useInitializeZoneStatuses";
import { buildStatus } from "../../../../lib/memberRiskFlagFactory";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type {
  ClinicalProfileFormSchema,
  CurrentStatusFormSchema,
} from "../../../../schemas/clinicalProfile.schema";
import { ZoneStatusBlock } from "./ZoneStatusBlock";
import { buildZoneStatusViews } from "./zoneStatusView";

interface ZonesStepProps {
  riskFlagIndex: number;
  affectedZones?: BodyZone[];
}

export function ZonesStep({ riskFlagIndex, affectedZones }: ZonesStepProps) {
  const arrayName = memberRiskFlagPaths.currentStatusArray(riskFlagIndex);
  const messageName = memberRiskFlagPaths.currentStatusPath(
    riskFlagIndex,
  ) as Path<ClinicalProfileFormSchema>;

  const { control, getValues } = useFormContext<ClinicalProfileFormSchema>();
  const { fields, append, remove } = useFieldArray<ClinicalProfileFormSchema>({
    name: arrayName,
    control,
  });

  useInitializeZoneStatuses({
    affectedZones,
    getCurrent: () =>
      getValues(arrayName) as CurrentStatusFormSchema[] | undefined,
    append,
  });

  const statuses = fields as unknown as CurrentStatusFormSchema[];
  const views = buildZoneStatusViews(affectedZones, statuses);

  const rawStatuses =
    (getValues(arrayName) as CurrentStatusFormSchema[] | undefined) ?? [];
  const isStatusPersisted = (statusIndex: number): boolean =>
    Boolean(rawStatuses[statusIndex]?.id);

  return (
    <div className="flex flex-col gap-4">
      {views.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
          Esta bandera no tiene zonas declaradas. Editá la bandera para asignar
          zonas afectadas.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {views.map((view) => (
            <ZoneStatusBlock
              key={`${view.bodyZone}-${view.isLegacy ? "legacy" : "active"}`}
              riskFlagIndex={riskFlagIndex}
              view={view}
              isStatusPersisted={isStatusPersisted}
              onAddSide={(side) => {
                append(buildStatus(view.bodyZone, side));
              }}
              onRemoveStatus={(index) => {
                remove(index);
              }}
            />
          ))}
        </div>
      )}

      <FormMessage<ClinicalProfileFormSchema> name={messageName} />
    </div>
  );
}

ZonesStep.displayName = "ZonesStep";
