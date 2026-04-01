import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@shared/ui";
import type { AttendanceInstructorResponse } from "../../../types";
import { getLastLoginInfo } from "@features/instructors/utils/instructors.utils";

export const instructorAttendanceColumns: ColumnDef<
  AttendanceInstructorResponse,
  unknown
>[] = [
  {
    id: "attendanceDate",
    header: "Última conexión",
    cell: ({ row }) => {
      const lastLogin = getLastLoginInfo(row.original.attendanceDate);

      return (
        <Badge intent={lastLogin.intent} size="md">
          {lastLogin.label}
        </Badge>
      );
    },
  },
  {
    id: "arrivalTime",
    header: "Hora de ingreso",
  },
  {
    id: "departureTime",
    header: "Hora de salida",
  },
  {
    id: "departureRegistered",
    header: "Estado de salida",
  },
];
