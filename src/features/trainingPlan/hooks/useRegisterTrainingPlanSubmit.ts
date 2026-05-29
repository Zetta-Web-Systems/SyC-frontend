import { confirm } from "@shared/stores/confirm.store";
import type { MutationLike } from "@shared/types/mutations.types";
import { useRegisterTrainingPlanMutation } from "./mutations/useRegisterTrainingPlanMutation";
import { useRegisterTrainingPlanTemplateMutation } from "./mutations/useRegisterTrainingPlanTemplateMutation";
import { buildRegisterTrainingPlanPayload } from "../lib/registerTrainingPlanPayload";
import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";

interface UseRegisterTrainingPlanSubmitOptions {
  onSuccess: () => void;
}

interface UseRegisterTrainingPlanSubmitResult {
  isPending: boolean;
  mutation: MutationLike;
  handleSubmit: (data: RegisterTrainingPlanFormSchema) => void;
}

export function useRegisterTrainingPlanSubmit({
  onSuccess,
}: UseRegisterTrainingPlanSubmitOptions): UseRegisterTrainingPlanSubmitResult {
  const planMutation = useRegisterTrainingPlanMutation();
  const templateMutation = useRegisterTrainingPlanTemplateMutation();

  const isPending = planMutation.isPending || templateMutation.isPending;
  const mutation: MutationLike = {
    isError: planMutation.isError || templateMutation.isError,
    error: planMutation.error ?? templateMutation.error,
  };

  function performRegister(data: RegisterTrainingPlanFormSchema) {
    const payload = buildRegisterTrainingPlanPayload(data);
    if (payload.kind === "plan") {
      planMutation.mutate(
        { memberId: payload.memberId, dto: payload.dto },
        { onSuccess },
      );
    } else {
      templateMutation.mutate(payload.dto, { onSuccess });
    }
  }

  function handleSubmit(data: RegisterTrainingPlanFormSchema) {
    const isTemplate = data.mode === "template";
    confirm({
      intent: "info",
      title: isTemplate ? "Registrar plantilla" : "Registrar planificación",
      description: isTemplate
        ? "¿Estás seguro que deseas registrar la plantilla?"
        : "¿Estás seguro que deseas registrar la planificación?",
      confirmLabel: "Registrar",
      onConfirm: () => performRegister(data),
    });
  }

  return { isPending, mutation, handleSubmit };
}
