import { useQuery } from "@tanstack/react-query";
import { getSlotTags } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useSlotTagsQuery() {
  return useQuery({
    queryKey: SCHEDULE_KEYS.tags(),
    queryFn: getSlotTags,
  });
}
