import { createFileRoute } from "@tanstack/react-router";
import RegisterExercisePage from "@features/exercise/pages/RegisterExercisePage";

export const Route = createFileRoute(
  "/_authenticated/exercises_/$groupId_/register",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId } = Route.useParams();
  return <RegisterExercisePage groupId={groupId} />;
}
