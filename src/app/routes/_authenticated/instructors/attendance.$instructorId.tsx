import { createFileRoute } from "@tanstack/react-router";
import { InstructorAttendancePage } from "@features/attendance/instructor";

export const Route = createFileRoute(
  "/_authenticated/instructors/attendance/$instructorId",
)({
  component: InstructorAttendancePage,
});
