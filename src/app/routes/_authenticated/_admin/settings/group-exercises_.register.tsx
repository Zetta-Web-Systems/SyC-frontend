import { createFileRoute } from "@tanstack/react-router";
import RegisterGroupExercisePage from "@features/exercise/pages/RegisterGroupExercisePage";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/group-exercises_/register",
)({
  component: RegisterGroupExercisePage,
});
