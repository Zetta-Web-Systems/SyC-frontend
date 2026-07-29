import { createFileRoute } from "@tanstack/react-router";
import { TrainingPlansPage } from "@features/trainingPlan";

export const Route = createFileRoute("/_authenticated/training-plans")({
  component: TrainingPlansPage,
});
