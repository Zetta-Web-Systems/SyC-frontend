import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@shared/ui";
import { formatDateTime } from "@shared/utils/date.utils";
import type { Instructor } from "@features/instructors/types";

export const instructorsColumns: ColumnDef<Instructor, unknown>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "lastname",
    header: "Apellido",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    id: "lastLoginAt",
    header: "Última conexión",
    cell: ({ row }) => {
      const lastLoginAt = row.original.lastLoginAt;

      return <p>{lastLoginAt ? formatDateTime(lastLoginAt) : "Nunca"}</p>;
    },
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <Badge intent={isActive ? "success" : "error"} size="md">
          {isActive ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
];
