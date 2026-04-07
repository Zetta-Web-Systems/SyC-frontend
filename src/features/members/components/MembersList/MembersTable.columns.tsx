import type { ColumnDef } from "@tanstack/react-table";
import { Phone } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import type { Member } from "../../types";
import { TRAINING_GOAL_LABELS } from "../../constants";

export const membersColumns: ColumnDef<Member, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name, lastname, image } = row.original;
      const initials = (name.charAt(0) + lastname.charAt(0)).toUpperCase();
      const fullName = `${name} ${lastname}`;

      return (
        <div className="flex items-center justify-start gap-4">
          <Avatar
            size="md"
            color="primary"
            src={image ?? null}
            fallback={initials}
            alt={fullName}
          />
          <span className="font-medium">{fullName}</span>
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
    id: "trainingGoal",
    header: "Objetivo",
    cell: ({ row }) => {
      const goal = row.original.trainingGoal;
      if (!goal) {
        return <span className="italic text-neutral-400">Sin objetivo</span>;
      }
      return <span>{TRAINING_GOAL_LABELS[goal]}</span>;
    },
  },
  {
    id: "bornDate",
    header: "Fecha de nac.",
    cell: ({ row }) => {
      const bornDate = row.original.bornDate;
      return bornDate ? (
        <span>{formatDate(bornDate)}</span>
      ) : (
        <span className="italic text-neutral-400">Sin registro</span>
      );
    },
  },
  {
    id: "currentWeight",
    header: "Peso",
    cell: ({ row }) => {
      const weight = row.original.currentWeight;
      return weight ? (
        <span>{weight} kg</span>
      ) : (
        <span className="italic text-neutral-400">Sin registro</span>
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
