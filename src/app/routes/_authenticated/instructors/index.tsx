import { createFileRoute } from "@tanstack/react-router";
import { InstructorsPage } from "@features/instructors";

export const Route = createFileRoute("/_authenticated/instructors/")({
  component: InstructorsPage,
});
