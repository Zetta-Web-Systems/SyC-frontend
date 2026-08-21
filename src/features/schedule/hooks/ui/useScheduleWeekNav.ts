import { useCallback, useMemo, useState } from "react";
import {
  addWeeks,
  formatWeekDescription,
  formatWeekRange,
  getWeekRange,
  startOfWeek,
} from "../../lib/scheduleWeek";

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

  const { from, to } = useMemo(() => getWeekRange(anchor), [anchor]);

  const isCurrentWeek = useMemo(
    () => getWeekRange(new Date()).from === from,
    [from],
  );

  return {
    from,
    to,
    rangeLabel: formatWeekRange(from, to),
    description: formatWeekDescription(from, to),
    isCurrentWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}
