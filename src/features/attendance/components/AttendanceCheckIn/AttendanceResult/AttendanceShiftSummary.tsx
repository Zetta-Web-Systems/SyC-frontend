import { cn } from "@shared/lib/cn";
import { Card } from "@shared/ui";
import { formatDuration, formatTimeShort } from "@shared/utils/date.utils";

interface AttendanceShiftSummaryProps {
  arrivalTime: string;
  departureTime: string;
}

interface ShiftStatProps {
  label: string;
  value: string;
  emphasis?: boolean;
}

function ShiftStat({ label, value, emphasis = false }: ShiftStatProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[22px] text-neutral-600">{label}</span>
      <span
        className={cn(
          "leading-none text-neutral-900 tabular-nums",
          emphasis ? "text-[52px] font-bold" : "text-[44px] font-semibold",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function AttendanceShiftSummary({
  arrivalTime,
  departureTime,
}: AttendanceShiftSummaryProps) {
  return (
    <Card
      surface="panel"
      className="flex w-full flex-wrap items-center justify-center gap-10 rounded-3xl border-2 p-8 motion-safe:animate-[attendance-card-up_450ms_ease-out_250ms_both]"
    >
      <ShiftStat label="Entrada" value={formatTimeShort(arrivalTime)} />
      <span aria-hidden="true" className="h-0.5 w-10 bg-neutral-300" />
      <ShiftStat label="Salida" value={formatTimeShort(departureTime)} />
      <span aria-hidden="true" className="h-20 w-0.5 bg-neutral-200" />
      <ShiftStat
        label="Estuviste"
        value={formatDuration(arrivalTime, departureTime)}
        emphasis
      />
    </Card>
  );
}

AttendanceShiftSummary.displayName = "AttendanceShiftSummary";
