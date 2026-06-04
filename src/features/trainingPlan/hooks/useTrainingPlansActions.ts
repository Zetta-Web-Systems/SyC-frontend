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
} from "../lib/trainingPlanKind";
import { PlanState } from "../constants";
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
    const isTemplate = kind === TRAINING_PLAN_KIND.TEMPLATE;
    const isCancelled = trainingPlan.state === PlanState.CANCELLED;

    const entity = isTemplate ? "plantilla" : "planificación";
    const verb = isCancelled ? "Eliminar" : "Cancelar";
    const action = `${verb} ${entity}`;

    confirm({
      intent: "danger",
      title: action,
      description: `¿Estás seguro que deseas ${verb.toLowerCase()} la ${description}?`,
      confirmLabel: action,
      cancelLabel: "Volver",
      onConfirm: () => {
        deleteMutation.mutate({ trainingPlanId: trainingPlan.id });
      },
    });
  }

  function handleExtend(trainingPlan: TrainingPlanSimple) {
    const isRegular =
      getTrainingPlanKind(trainingPlan) === TRAINING_PLAN_KIND.REGULAR;
    const isCancelled = trainingPlan.state === PlanState.CANCELLED;
    if (!isRegular || isCancelled) {
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
