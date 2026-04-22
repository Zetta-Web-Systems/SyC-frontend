import { Badge } from "@shared/ui";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";

interface ZoneBadgeListProps {
  zones: BodyZone[];
  max: number;
}

export function ZoneBadgeList({ zones, max }: ZoneBadgeListProps) {
  if (zones.length === 0) return null;

  const visible = zones.slice(0, max);
  const remaining = zones.length - visible.length;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {visible.map((zone) => (
        <Badge key={zone} size="sm" intent="neutral">
          {BODY_ZONE_LABELS[zone] ?? zone}
        </Badge>
      ))}

      {remaining > 0 && (
        <span className="text-xs text-neutral-400">+{remaining} más</span>
      )}
    </div>
  );
}

ZoneBadgeList.displayName = "ZoneBadgeList";
