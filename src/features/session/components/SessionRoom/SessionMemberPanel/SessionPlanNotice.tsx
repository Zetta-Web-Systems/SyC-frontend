import { CalendarCheck, CalendarX, Info } from "lucide-react";
import { Button } from "@shared/ui";
import type { PlanDayPosition, SessionMemberPlan } from "../../../types";

interface SessionPlanNoticeProps {
  plan: SessionMemberPlan;
  position: PlanDayPosition;
  onGoToSuggested: (position: PlanDayPosition) => void;
}

export function SessionPlanNotice({
  plan,
  position,
  onGoToSuggested,
}: SessionPlanNoticeProps) {
  if (plan.kind === "current") {
    if (plan.week === position.week && plan.day === position.day) return null;

    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-info/30 bg-info/10 px-4 py-2 text-sm text-neutral-700">
        <Info size={18} aria-hidden="true" className="shrink-0 text-info" />
        <p className="flex-1">
          Estás viendo{" "}
          <strong>
            Semana {position.week} · Día {position.day}
          </strong>
          . Hoy le toca{" "}
          <strong>
            Semana {plan.week} · Día {plan.day}
          </strong>
          .
        </p>
        <Button
          variant="ghost"
          intent="primary"
          onClick={() => onGoToSuggested({ week: plan.week, day: plan.day })}
          className="h-11"
        >
          Ir al día que le toca
        </Button>
      </div>
    );
  }

  if (plan.kind === "weekDone") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-neutral-700">
        <CalendarCheck
          size={18}
          aria-hidden="true"
          className="shrink-0 text-success"
        />
        <p>
          Ya hizo todos los días de la Semana {plan.week}. Elegí qué día quiere
          repetir o adelantar.
        </p>
      </div>
    );
  }

  if (plan.kind === "outOfRange") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-neutral-700">
        <CalendarX
          size={18}
          aria-hidden="true"
          className="shrink-0 text-warning"
        />
        <p>El plan está activo, pero hoy no está dentro de sus fechas.</p>
      </div>
    );
  }

  return null;
}

SessionPlanNotice.displayName = "SessionPlanNotice";
