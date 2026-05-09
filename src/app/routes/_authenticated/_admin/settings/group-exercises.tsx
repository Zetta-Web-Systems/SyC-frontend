import { createFileRoute } from "@tanstack/react-router";
import { GroupExercisesPage } from "@features/exercise";

export const Route = createFileRoute(
  "/_authenticated/_admin/settings/group-exercises",
)({
  component: GroupExercisesPage,
});
