import type { ColumnDef } from "@tanstack/react-table";
import { IdCard } from "lucide-react";
import { Badge } from "@shared/ui";
import { formatDate, formatTimeShort } from "@shared/utils/date.utils";
import { Avatar } from "@shared/ui";
import type { Attendance } from "../../types";

export const attendanceColumns: ColumnDef<Attendance, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const { name, lastname, dni, profileImageUrl } = row.original;
      const initials = (name.charAt(0) + lastname.charAt(0)).toUpperCase();
      const fullName = `${name} ${lastname}`;

      return (
        <div className="flex items-center justify-start gap-4">
          <Avatar
            size="md"
            color="primary"
            src={profileImageUrl ?? null}
            fallback={initials}
            alt={fullName}
          />
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1 justify-center font-medium">
              {fullName}
            </span>
            <span className="flex items-center gap-1 justify-center text-xs">
              <IdCard
                size={12}
                className="text-primary-400"
                aria-hidden="true"
              />
              DNI: {dni}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "attendanceDate",
    header: "Fecha",
    cell: ({ row }) => (
      <div className="flex flex-row justify-center gap-1">
        <span className="text-sm">
          {formatDate(row.original.attendanceDate)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "arrivalTime",
    header: "Hora de ingreso",
    cell: ({ row }) => <span>{formatTimeShort(row.original.arrivalTime)}</span>,
  },
  {
    accessorKey: "departureTime",
    header: "Hora de salida",
    cell: ({ row }) => {
      const { departureTime } = row.original;

      if (!departureTime) {
        return (
          <Badge variant="dot" intent="success" size="md">
            EN CURSO
          </Badge>
        );
      }

      return <span>{formatTimeShort(departureTime)}</span>;
    },
  },
];
