import { useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AttendanceListPage } from "@features/attendance";

const attendanceSearchSchema = z.object({
  type: z.enum(["INSTRUCTOR", "MEMBER"]),
  personId: z.string().optional(),
  personName: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/attendances/")({
  validateSearch: attendanceSearchSchema,
  component: AttendancesIndexPage,
});

function AttendancesIndexPage() {
  const { type, personId, personName } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handlePersonClear = useCallback(() => {
    void navigate({
      search: (prev) => ({
        ...prev,
        personId: undefined,
        personName: undefined,
      }),
    });
  }, [navigate]);

  return (
    <AttendanceListPage
      type={type}
      personId={personId}
      personName={personName}
      onPersonClear={personId ? handlePersonClear : undefined}
    />
  );
}
