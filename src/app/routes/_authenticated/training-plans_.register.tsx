import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import RegisterTrainingPlanPage from "@features/trainingPlan/pages/RegisterTrainingPlanPage";

const registerTrainingPlanSearchSchema = z.object({
  createdExerciseId: z.string().optional(),
  resume: z.boolean().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/training-plans_/register",
)({
  validateSearch: registerTrainingPlanSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { createdExerciseId, resume } = Route.useSearch();
  return (
    <RegisterTrainingPlanPage
      createdExerciseId={createdExerciseId}
      resume={resume}
    />
  );
}
