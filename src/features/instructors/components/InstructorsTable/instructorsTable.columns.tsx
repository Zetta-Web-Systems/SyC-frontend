import type { ColumnDef } from "@tanstack/react-table";
import { Clock, Phone } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { getLastLoginInfo } from "@shared/utils/date.utils";
import type { Instructor } from "../../types";

export const instructorsColumns: ColumnDef<Instructor, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name, lastname, image } = row.original;
      const initials = (name.charAt(0) + lastname.charAt(0)).toUpperCase();
      const fullName = `${name} ${lastname}`;
      const lastLogin = getLastLoginInfo(row.original.lastLoginAt);

      return (
        <div className="flex items-center justify-start gap-4">
          <Avatar
            size="md"
            color="primary"
            src={image ?? null}
            fallback={initials}
            alt={fullName}
          />
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1 justify-center font-medium">
              {fullName}
            </span>
            <span className="flex items-center gap-1 justify-center text-xs">
              <Clock
                size={12}
                className="text-neutral-400"
                aria-hidden="true"
              />
              Última conexión:{" "}
              {
                <Badge intent={lastLogin.intent} size="sm">
                  {lastLogin.label}
                </Badge>
              }
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    id: "contact",
    header: "Contacto",
    cell: ({ row }) => {
      const { email, phone, emergencyPhone } = row.original;
      const hasPhone = Boolean(phone);
      const hasEmergency = Boolean(emergencyPhone);

      return (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-medium text-neutral-900">{email}</span>
          {hasPhone || hasEmergency ? (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {hasPhone && (
                <span className="flex items-center gap-1">
                  <Phone
                    size={12}
                    className="text-success"
                    aria-hidden="true"
                  />
                  {phone}
                </span>
              )}
              {hasPhone && hasEmergency && (
                <span className="text-neutral-300" aria-hidden="true">
                  |
                </span>
              )}
              {hasEmergency && (
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-info" aria-hidden="true" />
                  {emergencyPhone}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs italic text-neutral-400">
              Sin teléfono registrado
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => {
      const address = row.original.address;
      return address ? (
        <span>{address}</span>
      ) : (
        <span className="italic text-neutral-400">Sin dirección</span>
      );
    },
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <Badge variant="dot" intent={isActive ? "success" : "error"} size="md">
          {isActive ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
];
