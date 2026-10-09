import { Badge, type BadgeProps } from "@shared/ui";
import {
  DEPARTURE_STATE,
  DEPARTURE_STATE_INTENT,
  DEPARTURE_STATE_LABELS,
  type DepartureState,
} from "../../constants";

interface AttendanceDepartureBadgeProps {
  state: DepartureState;
  size?: BadgeProps["size"];
}

export function AttendanceDepartureBadge({
  state,
  size = "md",
}: AttendanceDepartureBadgeProps) {
  return (
    <Badge
      variant="dot"
      intent={DEPARTURE_STATE_INTENT[state]}
      size={size}
      title={
        state === DEPARTURE_STATE.NOT_REGISTERED
          ? "No se marcó la salida ese día"
          : undefined
      }
    >
      {DEPARTURE_STATE_LABELS[state]}
    </Badge>
  );
}

AttendanceDepartureBadge.displayName = "AttendanceDepartureBadge";
