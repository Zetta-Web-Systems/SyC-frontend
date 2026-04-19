import { Badge } from "@shared/ui";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import type { RiskFlag } from "@features/riskFlags";
import { MAX_VISIBLE_ZONES } from "../../../constants";

interface RiskFlagListItemProps {
  riskFlag: RiskFlag;
}

export function RiskFlagListItem({ riskFlag }: RiskFlagListItemProps) {
  const zones = riskFlag.affectedZones ?? [];
  const visible = zones.slice(0, MAX_VISIBLE_ZONES);
  const remaining = zones.length - visible.length;

  return (
    <>
      <span className="font-medium">{riskFlag.name}</span>
      {zones.length > 0 && (
        <span className="flex gap-1">
          {visible.map((zone) => (
            <Badge key={zone} size="sm" intent="neutral">
              {BODY_ZONE_LABELS[zone]}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge size="sm" intent="neutral">
              +{remaining}
            </Badge>
          )}
        </span>
      )}
    </>
  );
}

RiskFlagListItem.displayName = "RiskFlagListItem";
