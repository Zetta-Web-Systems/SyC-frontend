import { createFileRoute } from "@tanstack/react-router";
import UpdateExercisePage from "@features/exercise/pages/UpdateExercisePage";

export const Route = createFileRoute(
  "/_authenticated/exercises_/$groupId_/update/$exerciseId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId, exerciseId } = Route.useParams();
  return <UpdateExercisePage groupId={groupId} exerciseId={exerciseId} />;
}
