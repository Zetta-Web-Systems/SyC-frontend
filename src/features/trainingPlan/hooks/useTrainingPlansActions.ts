import { useNavigate } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";
import { useDeleteTrainingPlanMutation } from "./mutations/useDeleteTrainingPlanMutation";
import type { TrainingPlanSimple } from "../types";

export function useTrainingPlansActions() {
  const navigate = useNavigate();

  const deleteMutation = useDeleteTrainingPlanMutation();

  const handleOpenRegister = () => navigate({ to: "/training-plans/register" });

  const handleOpenEdit = (trainingPlan: TrainingPlanSimple) =>
    navigate({
      to: "/training-plans/profile/$trainingPlanId",
      params: { trainingPlanId: trainingPlan.id },
    });

  function handleDelete(trainingPlan: TrainingPlanSimple) {
    const { name, lastname } = trainingPlan.member;
    confirm({
      intent: "danger",
      title: "Eliminar planificación",
      description: `¿Estas seguro que deseas eliminar la planificación de ${name} ${lastname}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ trainingPlanId: trainingPlan.id });
      },
    });
  }

  return {
    handleOpenRegister,
    handleOpenEdit,
    handleDelete,
  };
}
