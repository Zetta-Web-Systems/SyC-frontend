import { createFileRoute } from "@tanstack/react-router";
import ProfileExercisePage from "@features/exercise/pages/ProfileExercisePage";

export const Route = createFileRoute(
  "/_authenticated/exercises_/$groupId_/profile/$exerciseId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId, exerciseId } = Route.useParams();
  return <ProfileExercisePage groupId={groupId} exerciseId={exerciseId} />;
}
