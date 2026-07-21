import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import RegisterExercisePage from "@features/exercise/pages/RegisterExercisePage";

const registerExerciseSearchSchema = z.object({
  groupId: z.string().optional(),
  name: z.string().optional(),
  from: z.literal("training-plan").optional(),
});

export const Route = createFileRoute("/_authenticated/exercises_/register")({
  validateSearch: registerExerciseSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { groupId, name, from } = Route.useSearch();
  return (
    <RegisterExercisePage groupId={groupId} initialName={name} from={from} />
  );
}
