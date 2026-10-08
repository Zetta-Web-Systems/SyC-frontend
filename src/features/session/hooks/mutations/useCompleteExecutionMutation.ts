import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRAINING_PLANS_KEYS } from "@features/trainingPlan";
import { SESSION_KEYS } from "../../constants";
import { completeExecution } from "../../services/session.api";
import { applyExecutionUpdate } from "../../lib/sessionProgress";
import type { CompleteExecutionDto, SessionPlanDay } from "../../types";

interface CompleteExecutionVariables {
  executionId: string;
  dto: CompleteExecutionDto;
}

export function useCompleteExecutionMutation(
  memberId: string,
  week: number,
  day: number,
  trainingPlanId: string | undefined,
) {
  const queryClient = useQueryClient();
  const planDayKey = SESSION_KEYS.planDay(memberId, week, day);

  return useMutation({
    mutationFn: ({ executionId, dto }: CompleteExecutionVariables) =>
      completeExecution(executionId, dto),
    onMutate: async ({ executionId, dto }) => {
      await queryClient.cancelQueries({ queryKey: planDayKey });
      const previous = queryClient.getQueryData<SessionPlanDay>(planDayKey);

      if (previous) {
        queryClient.setQueryData<SessionPlanDay>(
          planDayKey,
          applyExecutionUpdate(
            previous,
            executionId,
            dto.isCompleted,
            dto.instructorObservations,
          ),
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(planDayKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: planDayKey });
      void queryClient.invalidateQueries({ queryKey: SESSION_KEYS.boards() });
      if (trainingPlanId) {
        void queryClient.invalidateQueries({
          queryKey: TRAINING_PLANS_KEYS.detail(trainingPlanId),
        });
      }
    },
  });
}
