import { createFileRoute } from "@tanstack/react-router";
import { AttendancePage } from "@features/attendance";

export const Route = createFileRoute("/_attendance/attendance")({
  component: AttendancePage,
});
