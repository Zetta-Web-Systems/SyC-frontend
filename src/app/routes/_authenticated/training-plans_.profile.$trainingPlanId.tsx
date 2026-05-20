import { createFileRoute } from "@tanstack/react-router";
import ProfileTrainingPlanPage from "@features/trainingPlan/pages/ProfileTrainingPlanPage";

export const Route = createFileRoute(
  "/_authenticated/training-plans_/profile/$trainingPlanId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { trainingPlanId } = Route.useParams();
  return <ProfileTrainingPlanPage trainingPlanId={trainingPlanId} />;
}
