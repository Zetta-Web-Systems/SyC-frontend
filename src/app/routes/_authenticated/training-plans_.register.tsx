import { createFileRoute } from "@tanstack/react-router";
import RegisterTrainingPlanPage from "@features/trainingPlan/pages/RegisterTrainingPlanPage";

export const Route = createFileRoute(
  "/_authenticated/training-plans_/register",
)({
  component: RegisterTrainingPlanPage,
});
