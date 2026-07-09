import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import type { TrainingPlanSimple } from "../../types";
import { PLAN_STATE_BADGE } from "../../constants";
import {
  getTrainingPlanKind,
  TRAINING_PLAN_KIND,
} from "../../lib/trainingPlanKind";

export const trainingPlansColumns: ColumnDef<TrainingPlanSimple, unknown>[] = [
  {
    id: "member",
    header: "Alumno/Plantilla",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const plan = row.original;
      const isTemplate =
        getTrainingPlanKind(plan) === TRAINING_PLAN_KIND.TEMPLATE;

      const fullName = plan.member
        ? `${plan.member.name} ${plan.member.lastname}`
        : null;
      const title = fullName ?? plan.templateName ?? "Plantilla";
      const subtitle =
        !isTemplate && plan.planNumber != null
          ? `Plan #${plan.planNumber}`
          : null;

      return (
        <div className="flex items-center justify-start gap-4">
          <div className="relative shrink-0">
            {plan.member ? (
              <Avatar
                size="md"
                color="primary"
                src={plan.member.image ?? null}
                fallback={(
                  plan.member.name.charAt(0) + plan.member.lastname.charAt(0)
                ).toUpperCase()}
                alt={fullName ?? ""}
              />
            ) : (
              <Avatar
                size="md"
                color="violet"
                src={null}
                fallback={<ClipboardList size={18} aria-hidden="true" />}
                alt={title}
              />
            )}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium">{title}</span>
            {subtitle && (
              <span className="text-xs text-neutral-500">{subtitle}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "dates",
    header: "Fechas",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;

      if (!startDate && !endDate) {
        return <span className="italic text-neutral-400">Sin fechas</span>;
      }

      return (
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          {startDate ? (
            <span>{formatDate(startDate)}</span>
          ) : (
            <span className="italic text-neutral-400">Sin inicio</span>
          )}
          <span className="text-primary-600" aria-hidden="true">
            -
          </span>
          {endDate ? (
            <span>{formatDate(endDate)}</span>
          ) : (
            <span className="italic text-neutral-400">Sin fin</span>
          )}
        </div>
      );
    },
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
    header: "Frecuencia",
    cell: ({ row }) => {
      const days = row.original.daysPerWeek;
      return (
        <span>
          {days} {days === 1 ? "día" : "días"} por semana
        </span>
      );
    },
  },
  {
    id: "createdBy",
    header: "Profesor",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy?.trim();

      if (!createdBy) {
        return <span className="italic text-neutral-400">Sin asignar</span>;
      }

      return <span>{createdBy}</span>;
    },
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const badge = PLAN_STATE_BADGE[row.original.state];

      return (
        <Badge variant="dot" intent={badge.intent} size="md">
          {badge.label.toUpperCase()}
        </Badge>
      );
    },
  },
];
