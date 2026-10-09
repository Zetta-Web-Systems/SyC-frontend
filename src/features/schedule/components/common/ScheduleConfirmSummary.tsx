import { UserRoundCheck, UserRoundMinus } from "lucide-react";
import { cn } from "@shared/lib/cn";

export interface ScheduleConfirmRow {
  label: string;
  value: string;
}

export interface ScheduleConfirmImpact {
  text: string;
  tone: "danger" | "neutral";
}

interface ScheduleConfirmSummaryProps {
  rows: ScheduleConfirmRow[];
  impact?: ScheduleConfirmImpact;
  note?: string;
}

export function ScheduleConfirmSummary({
  rows,
  impact,
  note,
}: ScheduleConfirmSummaryProps) {
  const ImpactIcon =
    impact?.tone === "danger" ? UserRoundMinus : UserRoundCheck;

  return (
    <div className="flex flex-col gap-3">
      <dl className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-neutral-50/60">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 px-3 py-2"
          >
            <dt className="text-[11.5px] font-bold tracking-wide text-neutral-400 uppercase">
              {row.label}
            </dt>

            <dd className="text-right text-sm font-semibold text-neutral-800">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {impact && (
        <p
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
            impact.tone === "danger"
              ? "bg-error/10 text-error"
              : "bg-neutral-100 text-neutral-500",
          )}
        >
          <ImpactIcon size={16} aria-hidden="true" className="shrink-0" />
          {impact.text}
        </p>
      )}

      {note && <p className="text-xs text-neutral-500">{note}</p>}
    </div>
  );
}

ScheduleConfirmSummary.displayName = "ScheduleConfirmSummary";
