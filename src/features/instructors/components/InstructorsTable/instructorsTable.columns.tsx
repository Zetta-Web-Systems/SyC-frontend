import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, Badge } from "@shared/ui";
import type { Instructor } from "@features/instructors/types";
import { getLastLoginInfo } from "../../utils/instructors.utils";

export const instructorsColumns: ColumnDef<Instructor, unknown>[] = [
  {
    id: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const { name, lastname, image } = row.original;
      const initials = (name.charAt(0) + lastname.charAt(0)).toUpperCase();
      const fullName = `${name} ${lastname}`;

      return (
        <div className="flex items-center justify-start gap-2">
          <Avatar
            size="sm"
            color="primary"
            src={image ?? null}
            fallback={initials}
            alt={fullName}
          />
          <span>{fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => {
      const phone = row.original.phone;
      return <span>{phone || "-"}</span>;
    },
  },
  {
    accessorKey: "emergencyPhone",
    header: "Teléfono de emergencia",
    cell: ({ row }) => {
      const phone = row.original.emergencyPhone;
      return <span>{phone || "-"}</span>;
    },
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => {
      const address = row.original.address;
      return <span>{address || "-"}</span>;
    },
  },
  {
    id: "lastLoginAt",
    header: "Última conexión",
    cell: ({ row }) => {
      const lastLogin = getLastLoginInfo(row.original.lastLoginAt);

      return (
        <Badge intent={lastLogin.intent} size="md">
          {lastLogin.label}
        </Badge>
      );
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
