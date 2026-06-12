import { createFileRoute } from "@tanstack/react-router";
import UpdateTrainingPlanPage from "@features/trainingPlan/pages/UpdateTrainingPlanPage";

export const Route = createFileRoute(
  "/_authenticated/training-plans_/edit/$trainingPlanId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { trainingPlanId } = Route.useParams();
  return <UpdateTrainingPlanPage trainingPlanId={trainingPlanId} />;
}
