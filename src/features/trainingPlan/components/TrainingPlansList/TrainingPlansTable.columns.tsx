import type { ColumnDef } from "@tanstack/react-table";
import { LayoutTemplate } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import type { TrainingPlanSimple } from "../../types";
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
      const kind = getTrainingPlanKind(plan);
      const isTemplate = kind !== TRAINING_PLAN_KIND.REGULAR;

      const fullName = plan.member
        ? `${plan.member.name} ${plan.member.lastname}`
        : null;
      const title = fullName ?? plan.templateName ?? "Plantilla";
      const subtitle =
        kind === TRAINING_PLAN_KIND.REGULAR
          ? plan.planNumber != null
            ? `Plan #${plan.planNumber}`
            : null
          : kind === TRAINING_PLAN_KIND.MEMBER_TEMPLATE
            ? (plan.templateName ?? "Plantilla")
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
                color="primary"
                src={null}
                fallback={<LayoutTemplate size={18} aria-hidden="true" />}
                alt={title}
              />
            )}
            {isTemplate && plan.member && (
              <span
                title="Plantilla"
                aria-label="Plantilla"
                className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-primary-600 text-white ring-2 ring-white drop-shadow-sm"
              >
                <LayoutTemplate size={11} aria-hidden="true" />
              </span>
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
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const plan = row.original;
      const isTemplate =
        getTrainingPlanKind(plan) !== TRAINING_PLAN_KIND.REGULAR;

      if (isTemplate) {
        return (
          <Badge variant="dot" intent="info" size="md">
            PLANTILLA
          </Badge>
        );
      }

      return (
        <Badge
          variant="dot"
          intent={plan.isActive ? "success" : "error"}
          size="md"
        >
          {plan.isActive ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
];
