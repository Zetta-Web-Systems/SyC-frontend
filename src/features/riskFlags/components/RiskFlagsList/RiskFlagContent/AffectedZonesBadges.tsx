import { Badge } from "@shared/ui";
import {
  BODY_ZONE_GROUP_INTENT,
  BODY_ZONE_LABELS,
  BODY_ZONE_TO_GROUP_LABEL,
  type BodyZone,
} from "../../../constants";

interface AffectedZonesBadgesProps {
  zones: BodyZone[] | undefined;
  max?: number;
}

export function AffectedZonesBadges({
  zones,
  max = 3,
}: AffectedZonesBadgesProps) {
  if (!zones || zones.length === 0) {
    return <span className="text-xs italic text-neutral-400">Sin zonas</span>;
  }

  const visible = zones.slice(0, max);
  const overflow = zones.length - visible.length;

  return (
    <div className="flex flex-wrap justify-center items-center gap-1">
      {visible.map((zone) => {
        const groupLabel = BODY_ZONE_TO_GROUP_LABEL[zone];
        const intent = BODY_ZONE_GROUP_INTENT[groupLabel] ?? "neutral";
        return (
          <Badge key={zone} intent={intent} size="md">
            {BODY_ZONE_LABELS[zone]}
          </Badge>
        );
      })}
      {overflow > 0 && (
        <Badge intent="neutral" size="md">
          +{overflow}
        </Badge>
      )}
    </div>
  );
}

AffectedZonesBadges.displayName = "AffectedZonesBadges";
