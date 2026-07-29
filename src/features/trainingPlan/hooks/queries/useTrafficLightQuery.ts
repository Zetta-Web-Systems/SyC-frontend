import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlannedExerciseTrafficLight } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

const TRAFFIC_LIGHT_DEBOUNCE_MS = 200;

export function useTrafficLightQuery(
  memberId: string | undefined,
  exerciseId: string | undefined,
) {
  const enabled = !!memberId && !!exerciseId;
  const key = enabled ? `${memberId}:${exerciseId}` : "";

  const [armedKey, setArmedKey] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => setArmedKey(key), TRAFFIC_LIGHT_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [enabled, key]);

  const isArmed = enabled && armedKey === key;

  const query = useQuery({
    queryKey: TRAINING_PLANS_KEYS.trafficLight(
      memberId ?? "",
      exerciseId ?? "",
    ),
    queryFn: () =>
      getPlannedExerciseTrafficLight({
        memberId: memberId as string,
        exerciseId: exerciseId as string,
      }),
    enabled: isArmed,
  });

  const isLoading = enabled && !query.data && (!isArmed || query.isFetching);

  return {
    data: query.data,
    isLoading,
    isError: query.isError,
  };
}
