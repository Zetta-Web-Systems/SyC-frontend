import type { ReactNode } from "react";
import {
  CalendarCheck,
  CalendarOff,
  CalendarX,
  CheckCheck,
  Play,
} from "lucide-react";
import { cn } from "@shared/lib/cn";
import type { MemberDayProgress, SessionMemberPlan } from "../../../types";

interface StatusBoxProps {
  tone: string;
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
}

function StatusBox({
  tone,
  icon,
  title,
  description,
  trailing,
}: StatusBoxProps) {
  return (
    <div
      className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5", tone)}
    >
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        {description && (
          <p className="truncate text-sm opacity-80">{description}</p>
        )}
      </div>
      {trailing}
    </div>
  );
}

interface MemberPlanStatusProps {
  plan: SessionMemberPlan;
  progress?: MemberDayProgress;
  progressLoading?: boolean;
}

export function MemberPlanStatus({
  plan,
  progress,
  progressLoading,
}: MemberPlanStatusProps) {
  switch (plan.kind) {
    case "current": {
      const dayTitle = `Semana ${plan.week} · Día ${plan.day}${plan.dayLabel ? ` · ${plan.dayLabel}` : ""}`;

      if (progressLoading || !progress) {
        return <div className="h-15 animate-pulse rounded-xl bg-primary-50" />;
      }

      if (!progress.currentExercise) {
        return (
          <StatusBox
            tone="bg-success/10 text-success"
            icon={<CheckCheck size={18} aria-hidden="true" />}
            title="Día completo"
            description={dayTitle}
            trailing={
              <span className="text-sm font-bold tabular-nums">
                {progress.done}/{progress.total}
              </span>
            }
          />
        );
      }

      return (
        <div className="flex flex-col gap-1.5 rounded-xl bg-primary-50 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 text-sm font-semibold text-primary-700">
            <span className="truncate">{dayTitle}</span>
            <span className="shrink-0 tabular-nums">
              {progress.done}/{progress.total}
            </span>
          </div>
          <p className="flex min-w-0 items-center gap-1.5 text-sm text-neutral-800">
            <Play
              size={12}
              aria-hidden="true"
              className="shrink-0 fill-primary-500 text-primary-500"
            />
            <span className="shrink-0 font-semibold">Ahora:</span>
            <span className="truncate">{progress.currentExercise}</span>
          </p>
        </div>
      );
    }
    case "weekDone":
      return (
        <StatusBox
          tone="bg-success/10 text-success"
          icon={<CalendarCheck size={18} aria-hidden="true" />}
          title={`Semana ${plan.week} completa`}
          description="Elegí qué día repite o adelanta"
        />
      );
    case "outOfRange":
      return (
        <StatusBox
          tone="bg-warning/10 text-warning"
          icon={<CalendarX size={18} aria-hidden="true" />}
          title="Plan fuera de fecha"
          description="Activo, pero hoy no está en sus fechas"
        />
      );
    case "none":
      return (
        <StatusBox
          tone="bg-neutral-100 text-neutral-500"
          icon={<CalendarOff size={18} aria-hidden="true" />}
          title="Sin plan activo"
        />
      );
  }
}

MemberPlanStatus.displayName = "MemberPlanStatus";
