import { useNavigate } from "@tanstack/react-router";
import type { TrainingPlanSimple } from "../types";

export function useTrainingPlansActions() {
  const navigate = useNavigate();

  const handleOpenRegister = () => navigate({ to: "/training-plans/register" });

  const handleOpenEdit = (trainingPlan: TrainingPlanSimple) =>
    navigate({
      to: "/training-plans/profile/$trainingPlanId",
      params: { trainingPlanId: trainingPlan.id },
    });

  return {
    handleOpenRegister,
    handleOpenEdit,
  };
}
