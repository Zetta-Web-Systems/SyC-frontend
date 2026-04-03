import { useLongPress } from "@shared/hooks/useLongPress";
import { LONG_PRESS_DURATION } from "../../constants";

export function useAttendanceLongPress(
  onLongPress: () => void,
  duration: number = LONG_PRESS_DURATION,
) {
  return useLongPress(onLongPress, duration);
}
