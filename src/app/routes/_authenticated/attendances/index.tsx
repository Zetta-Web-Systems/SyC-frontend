import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AttendanceListPage } from "@features/attendance";

const attendanceSearchSchema = z.object({
  type: z.enum(["INSTRUCTOR", "MEMBER"]),
  personId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/attendances/")({
  validateSearch: attendanceSearchSchema,
  component: AttendancesIndexPage,
});

function AttendancesIndexPage() {
  const { type, personId } = Route.useSearch();

  return <AttendanceListPage type={type} personId={personId} />;
}
