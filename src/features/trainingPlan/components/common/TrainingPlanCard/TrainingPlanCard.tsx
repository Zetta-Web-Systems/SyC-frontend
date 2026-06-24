import type { ReactNode } from "react";
import { CalendarDays, ClipboardList, Clock, Repeat } from "lucide-react";
import { Avatar, Badge, Card, Spinner } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { formatDayMonth } from "@shared/utils/date.utils";
import { PLAN_STATE_BADGE } from "../../../constants";
import type { TrainingPlanSimple } from "../../../types";
import {
  getTrainingPlanKind,
  TRAINING_PLAN_KIND,
} from "../../../lib/trainingPlanKind";

export interface TrainingPlanCardProps {
  plan: TrainingPlanSimple;
  selected?: boolean;
  loading?: boolean;
  onSelect?: (plan: TrainingPlanSimple) => void;
  actions?: ReactNode;
  className?: string;
}

export function TrainingPlanCard({
  plan,
  selected = false,
  loading = false,
  onSelect,
  actions,
  className,
}: TrainingPlanCardProps) {
  const isTemplate = getTrainingPlanKind(plan) === TRAINING_PLAN_KIND.TEMPLATE;
  const badge = PLAN_STATE_BADGE[plan.state];

  const fullName = plan.member
    ? `${plan.member.name} ${plan.member.lastname}`
    : null;
  const title = fullName ?? plan.templateName ?? "Plantilla sin nombre";

  const interactive = !!onSelect;
  const showDates = !isTemplate && Boolean(plan.startDate || plan.endDate);
  const showPlanNumber = !isTemplate && plan.planNumber != null;

  return (
    <Card
      surface="panel"
      padding="md"
      interactive={interactive}
      selected={selected}
      className={cn(
        "relative flex flex-col gap-3 text-left",
        loading && "pointer-events-none opacity-60",
        className,
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      onClick={interactive ? () => onSelect(plan) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(plan);
              }
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
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
            {showPlanNumber && (
              <span
                className="absolute -right-1.5 -bottom-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-primary-500 px-1 text-[10px] font-bold text-white"
                aria-label={`Plan número ${plan.planNumber}`}
              >
                {plan.planNumber}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate font-semibold text-neutral-900">
              {title}
            </span>
            <Badge
              variant="dot"
              intent={badge.intent}
              size="sm"
              className="self-start"
            >
              {badge.label.toUpperCase()}
            </Badge>
          </div>
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <div className="flex items-center justify-center gap-2.5 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
        {showDates && (
          <>
            <Stat
              icon={<CalendarDays size={14} aria-hidden="true" />}
              value={`${plan.startDate ? formatDayMonth(plan.startDate) : "—"} - ${
                plan.endDate ? formatDayMonth(plan.endDate) : "—"
              }`}
            />
            <Divider />
          </>
        )}
        <Stat
          icon={<Clock size={14} aria-hidden="true" />}
          value={plan.durationInWeeks}
          unit="sem."
        />
        <Divider />
        <Stat
          icon={<Repeat size={14} aria-hidden="true" />}
          value={plan.daysPerWeek}
          unit={plan.daysPerWeek === 1 ? "día/sem" : "días/sem"}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-white/60">
          <Spinner size="sm" />
        </div>
      )}
    </Card>
  );
}

TrainingPlanCard.displayName = "TrainingPlanCard";

function Divider() {
  return (
    <span className="h-4 w-px shrink-0 bg-neutral-200" aria-hidden="true" />
  );
}

interface StatProps {
  icon: ReactNode;
  value: ReactNode;
  unit?: string;
}

function Stat({ icon, value, unit }: StatProps) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
      <span className="text-primary-400">{icon}</span>
      <span>
        <span className="font-semibold text-neutral-800">{value}</span>
        {unit ? ` ${unit}` : null}
      </span>
    </span>
  );
}
