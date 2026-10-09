import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getScheduleWeek } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

/**
 * Este hook mantiene la semana anterior en pantalla mientras carga la nueva
 * No tiene NADA que ver con ver la semana anterior a la actual, sino con mantener la UI estable mientras se hace un fetch de la semana que se quiere ver
 */
export function useScheduleWeekQuery(date: string) {
  return useQuery({
    queryKey: SCHEDULE_KEYS.week(date),
    queryFn: () => getScheduleWeek(date),
    placeholderData: keepPreviousData,
  });
}
