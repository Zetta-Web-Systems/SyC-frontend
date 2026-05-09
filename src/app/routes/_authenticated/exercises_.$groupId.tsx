import { createFileRoute } from "@tanstack/react-router";
import ExercisesByGroupPage from "@features/exercise/pages/ExercisesByGroupPage";

export const Route = createFileRoute("/_authenticated/exercises_/$groupId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId } = Route.useParams();
  return <ExercisesByGroupPage groupId={groupId} />;
}
