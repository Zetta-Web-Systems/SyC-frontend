import { createFileRoute } from "@tanstack/react-router";
import ExercisesPage from "@features/exercise/ExercisesPage";

export const Route = createFileRoute("/_authenticated/exercises")({
  component: ExercisesPage,
});
