import { Badge } from "@shared/ui";
import {
  BODY_ZONE_GROUPS,
  BODY_ZONE_GROUP_INTENT,
} from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";

interface MemberRiskFlagCardHeaderProps {
  name: string;
  affectedZones: BodyZone[];
}

export function MemberRiskFlagCardHeader({
  name,
  affectedZones,
}: MemberRiskFlagCardHeaderProps) {
  const uniqueGroups = BODY_ZONE_GROUPS.filter((group) =>
    group.zones.some((zone) => affectedZones.includes(zone)),
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-neutral-800">{name}</span>

      {uniqueGroups.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {uniqueGroups.map((group) => (
            <Badge
              key={group.label}
              size="sm"
              variant="dot"
              intent={BODY_ZONE_GROUP_INTENT[group.label] ?? "neutral"}
            >
              {group.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

MemberRiskFlagCardHeader.displayName = "MemberRiskFlagCardHeader";
