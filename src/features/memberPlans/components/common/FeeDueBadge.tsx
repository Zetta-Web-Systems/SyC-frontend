import { Badge } from "@shared/ui";
import { getFeeDueStatus, type FeeDueSource } from "../../lib/feeDueStatus";

interface FeeDueBadgeProps {
  fee: FeeDueSource;
}

export function FeeDueBadge({ fee }: FeeDueBadgeProps) {
  const { label, intent } = getFeeDueStatus(fee);

  return (
    <Badge variant="dot" intent={intent} size="md">
      {label}
    </Badge>
  );
}

FeeDueBadge.displayName = "FeeDueBadge";
