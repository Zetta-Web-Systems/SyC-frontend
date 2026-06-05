import { confirm } from "@shared/stores/confirm.store";
import type { MutationLike } from "@shared/types/mutations.types";
import { useRegisterTrainingPlanMutation } from "./mutations/useRegisterTrainingPlanMutation";
import { useRegisterTrainingPlanTemplateMutation } from "./mutations/useRegisterTrainingPlanTemplateMutation";
import { buildRegisterTrainingPlanPayload } from "../lib/registerTrainingPlanPayload";
import { RegisterTemplateNameField } from "../components/TrainingPlanForm/RegisterTemplateNameField/RegisterTemplateNameField";
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
    if (data.mode === "template") {
      const nameRef = { current: data.templateName ?? "" };
      confirm({
        intent: "info",
        title: "Registrar plantilla",
        description:
          "¿Estás seguro que deseas registrar la plantilla? El nombre es opcional, podés dejarlo vacío.",
        body: (
          <RegisterTemplateNameField
            defaultValue={data.templateName ?? ""}
            onValueChange={(value) => {
              nameRef.current = value;
            }}
          />
        ),
        confirmLabel: "Registrar",
        onConfirm: () => {
          performRegister({ ...data, templateName: nameRef.current.trim() });
        },
      });
      return;
    }

    confirm({
      intent: "info",
      title: "Registrar planificación",
      description: "¿Estás seguro que deseas registrar la planificación?",
      confirmLabel: "Registrar",
      onConfirm: () => performRegister(data),
    });
  }

  return { isPending, mutation, handleSubmit };
}
