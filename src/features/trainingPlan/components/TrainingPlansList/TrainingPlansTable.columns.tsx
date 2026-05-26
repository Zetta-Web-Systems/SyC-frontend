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
    header: "Alumno",
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
                color="neutral"
                src={null}
                fallback={<LayoutTemplate size={18} aria-hidden="true" />}
                alt={title}
              />
            )}
            {isTemplate && plan.member && (
              <span
                title="Plantilla"
                aria-label="Plantilla"
                className="pointer-events-none absolute -top-1 -left-1 z-10 flex size-4 items-center justify-center rounded-full bg-white drop-shadow-sm"
              >
                <LayoutTemplate
                  size={10}
                  aria-hidden="true"
                  className="text-primary-600"
                />
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
    id: "startDate",
    header: "Fecha de inicio",
    cell: ({ row }) => (
      <span>
        {row.original.startDate ? formatDate(row.original.startDate) : "—"}
      </span>
    ),
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
