import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import { SIDE_LABELS } from "../../constants";
import {
  groupNewStatusesByRiskFlag,
  type NewStatusPreview,
} from "../../lib/newStatusesPreview";

interface NewStatusesPreviewListProps {
  newStatuses: NewStatusPreview[];
}

export function NewStatusesPreviewList({
  newStatuses,
}: NewStatusesPreviewListProps) {
  const grouped = groupNewStatusesByRiskFlag(newStatuses);

  return (
    <ul className="flex flex-col gap-3">
      {grouped.map((group) => (
        <li
          key={group.riskFlagName}
          className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3"
        >
          <h4 className="text-sm font-semibold text-neutral-800">
            {group.riskFlagName}
          </h4>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-neutral-700">
            {group.items.map((item) => (
              <li
                key={`${item.bodyZone}-${item.side}-${item.painLevel}`}
                className="flex flex-wrap items-center gap-x-3 gap-y-1"
              >
                <span className="font-medium">
                  {BODY_ZONE_LABELS[item.bodyZone]}
                </span>
                <span className="text-xs text-neutral-500">
                  {SIDE_LABELS[item.side]}
                </span>
                <span className="text-xs text-neutral-500">
                  Dolor {item.painLevel}/10
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

NewStatusesPreviewList.displayName = "NewStatusesPreviewList";
