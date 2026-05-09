import { createFileRoute } from "@tanstack/react-router";
import UpdateGroupExercisePage from "@features/exercise/pages/UpdateGroupExercisePage";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/group-exercises_/update/$groupExerciseId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupExerciseId } = Route.useParams();
  return <UpdateGroupExercisePage groupExerciseId={groupExerciseId} />;
}
