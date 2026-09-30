import { Badge, type BadgeProps } from "@shared/ui";
import {
  MOOD_EMOJIS,
  MOOD_INTENT,
  MOOD_LABELS,
  type Mood,
} from "../../constants";

interface AttendanceMoodBadgeProps {
  mood: Mood;
  size?: BadgeProps["size"];
}

export function AttendanceMoodBadge({
  mood,
  size = "md",
}: AttendanceMoodBadgeProps) {
  return (
    <Badge intent={MOOD_INTENT[mood]} size={size}>
      <span aria-hidden="true" className="text-sm leading-none">
        {MOOD_EMOJIS[mood]}
      </span>
      {MOOD_LABELS[mood]}
    </Badge>
  );
}

AttendanceMoodBadge.displayName = "AttendanceMoodBadge";
