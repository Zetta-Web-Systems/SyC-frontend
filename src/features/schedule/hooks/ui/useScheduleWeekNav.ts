import { useCallback, useMemo, useState } from "react";
import { addWeeks, getWeekRange, startOfWeek } from "../../lib/scheduleWeek";

export function useScheduleWeekNav() {
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date()));

  const goToPreviousWeek = useCallback(() => {
    setAnchor((current) => addWeeks(current, -1));
  }, []);

  const goToNextWeek = useCallback(() => {
    setAnchor((current) => addWeeks(current, 1));
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setAnchor(startOfWeek(new Date()));
  }, []);

  const fallbackRange = useMemo(() => getWeekRange(anchor), [anchor]);

  return {
    date: fallbackRange.from,
    fallbackRange,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}
