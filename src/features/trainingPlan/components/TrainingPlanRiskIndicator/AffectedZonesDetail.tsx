import {
  SIDE_LABELS,
  getPainLabel,
  getPainTextClass,
} from "@features/clinicalProfiles";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import { cn } from "@shared/lib/cn";
import type { CurrentStatus } from "@features/clinicalProfiles";

interface AffectedZonesDetailProps {
  affected: CurrentStatus[];
}

export function AffectedZonesDetail({ affected }: AffectedZonesDetailProps) {
  return (
    <ul className="flex min-w-56 max-w-72 flex-col gap-2 p-1">
      {affected.map((s) => (
        <li
          key={s.id}
          className="flex items-center justify-between gap-3 text-xs"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-neutral-900">
              {BODY_ZONE_LABELS[s.bodyZone]}
              <span className="font-normal text-neutral-400">
                {" · "}
                {SIDE_LABELS[s.side]}
              </span>
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 font-semibold",
              getPainTextClass(s.painLevel),
            )}
          >
            {getPainLabel(s.painLevel)}
          </span>
        </li>
      ))}
    </ul>
  );
}

AffectedZonesDetail.displayName = "AffectedZonesDetail";
