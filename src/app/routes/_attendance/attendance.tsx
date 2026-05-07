import { createFileRoute } from "@tanstack/react-router";
import { AttendanceCheckInPage } from "@features/attendance";

export const Route = createFileRoute("/_attendance/attendance")({
  component: AttendanceCheckInPage,
});
