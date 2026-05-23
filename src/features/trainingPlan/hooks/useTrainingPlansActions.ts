import { createElement } from "react";
import { useNavigate } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";
import { ExtendPlanWeeksField } from "../components/TrainingPlansList/ExtendPlanWeeksField";
import { useDeleteTrainingPlanMutation } from "./mutations/useDeleteTrainingPlanMutation";
import { useExtendTrainingPlanMutation } from "./mutations/useExtendTrainingPlanMutation";
import {
  getTrainingPlanDescription,
  getTrainingPlanKind,
  TRAINING_PLAN_KIND,
} from "../utils/trainingPlanKind";
import type { TrainingPlanSimple } from "../types";

const DEFAULT_WEEKS_TO_EXTEND = 1;

export function useTrainingPlansActions() {
  const navigate = useNavigate();

  const deleteMutation = useDeleteTrainingPlanMutation();
  const extendMutation = useExtendTrainingPlanMutation();

  const handleOpenRegister = () => navigate({ to: "/training-plans/register" });

  const handleOpenEdit = (trainingPlan: TrainingPlanSimple) =>
    navigate({
      to: "/training-plans/profile/$trainingPlanId",
      params: { trainingPlanId: trainingPlan.id },
    });

  function handleDelete(trainingPlan: TrainingPlanSimple) {
    const kind = getTrainingPlanKind(trainingPlan);
    const description = getTrainingPlanDescription(trainingPlan);
    const title =
      kind === TRAINING_PLAN_KIND.REGULAR
        ? "Eliminar planificación"
        : "Eliminar plantilla";

    confirm({
      intent: "danger",
      title,
      description: `¿Estás seguro que deseas eliminar la ${description}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ trainingPlanId: trainingPlan.id });
      },
    });
  }

  function handleExtend(trainingPlan: TrainingPlanSimple) {
    if (getTrainingPlanKind(trainingPlan) !== TRAINING_PLAN_KIND.REGULAR) {
      return;
    }
    const description = getTrainingPlanDescription(trainingPlan);
    const selectedWeeks = { current: DEFAULT_WEEKS_TO_EXTEND };
    confirm({
      intent: "info",
      title: "Extender planificación",
      description: `¿Cuántas semanas deseas extender la ${description}?`,
      body: createElement(ExtendPlanWeeksField, {
        defaultValue: DEFAULT_WEEKS_TO_EXTEND,
        onChange: (weeks) => {
          selectedWeeks.current = weeks;
        },
      }),
      confirmLabel: "Extender",
      onConfirm: () => {
        extendMutation.mutate({
          trainingPlanId: trainingPlan.id,
          weeksToExtend: selectedWeeks.current,
        });
      },
    });
  }

  return {
    handleOpenRegister,
    handleOpenEdit,
    handleDelete,
    handleExtend,
  };
}
