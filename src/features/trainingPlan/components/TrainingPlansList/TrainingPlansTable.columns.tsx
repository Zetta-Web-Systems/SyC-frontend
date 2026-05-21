import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, Badge } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import type { TrainingPlanSimple } from "../../types";

export const trainingPlansColumns: ColumnDef<TrainingPlanSimple, unknown>[] = [
  {
    id: "member",
    header: "Alumno",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { member, planNumber } = row.original;
      const initials = (
        member.name.charAt(0) + member.lastname.charAt(0)
      ).toUpperCase();
      const fullName = `${member.name} ${member.lastname}`;

      return (
        <div className="flex items-center justify-start gap-4">
          <Avatar
            size="md"
            color="primary"
            src={member.image ?? null}
            fallback={initials}
            alt={fullName}
          />
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium">{fullName}</span>
            <span className="text-xs text-neutral-500">Plan #{planNumber}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "startDate",
    header: "Fecha de inicio",
    cell: ({ row }) => <span>{formatDate(row.original.startDate)}</span>,
  },
  {
    id: "durationInWeeks",
    header: "Duración",
    cell: ({ row }) => {
      const weeks = row.original.durationInWeeks;
      return (
        <span>
          {weeks} {weeks === 1 ? "semana" : "semanas"}
        </span>
      );
    },
  },
  {
    id: "daysPerWeek",
    header: "Días por semana",
    cell: ({ row }) => {
      const days = row.original.daysPerWeek;
      return (
        <span>
          {days} {days === 1 ? "día" : "días"}
        </span>
      );
    },
  },
  {
    id: "template",
    header: "Plantilla",
    cell: ({ row }) => {
      const { isTemplate, templateName } = row.original;
      if (!isTemplate) {
        return <span className="italic text-neutral-400">No</span>;
      }
      return <span>{templateName ?? "Sí"}</span>;
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
