import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getScheduleWeek } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

/**
 * Este hook mantiene la semana anterior en pantalla mientras carga la nueva
 */
export function useScheduleWeekQuery(from: string, to: string) {
  return useQuery({
    queryKey: SCHEDULE_KEYS.week(from, to),
    queryFn: () => getScheduleWeek(from, to),
    placeholderData: keepPreviousData,
  });
}
