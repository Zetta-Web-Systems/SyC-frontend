import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useMemberQuery } from "@features/members";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";
import { getActiveCurrentStatuses } from "../../lib/trafficLight";
import type { AffectedCurrentStatus } from "../../lib/trafficLight";

export function useTrainingPlanRiskStatuses(): AffectedCurrentStatus[] {
  const { control } = useFormContext<RegisterTrainingPlanFormSchema>();
  const memberId = useWatch({ control, name: "memberId" });
  const memberQuery = useMemberQuery(memberId);

  return useMemo(
    () => getActiveCurrentStatuses(memberQuery.data?.clinicalProfile),
    [memberQuery.data],
  );
}
