import { useMemo, useState } from "react";
import {
  findScheduleMatches,
  type ScheduleSearchMatches,
} from "../../lib/scheduleSearch";
import type { ScheduleWeek } from "../../types";

export interface ScheduleSearchState {
  search: string;
  setSearch: (value: string) => void;
  matches: ScheduleSearchMatches;
}

export function useScheduleSearch(
  week: ScheduleWeek | undefined,
): ScheduleSearchState {
  const [search, setSearch] = useState("");

  const matches = useMemo(
    () => findScheduleMatches(week, search),
    [week, search],
  );

  return { search, setSearch, matches };
}
