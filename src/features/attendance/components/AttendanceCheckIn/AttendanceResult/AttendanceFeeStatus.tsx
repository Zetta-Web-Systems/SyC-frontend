import { cn } from "@shared/lib/cn";
import {
  FEE_STATUS_BAND,
  FEE_STATUS_FRAME,
  FEE_STATUS_INK,
} from "../../../constants";
import type { FeeStatusView } from "../../../types";
import { formatDayMonth, formatWeekday } from "../../../utils/checkIn.utils";

interface AttendanceFeeStatusProps {
  status: FeeStatusView;
}

export function AttendanceFeeStatus({ status }: AttendanceFeeStatusProps) {
  return (
    <section
      aria-label="Estado de tu cuota"
      className={cn(
        "w-full overflow-hidden rounded-3xl border-4 bg-white text-center shadow-sm motion-safe:animate-[attendance-card-up_450ms_ease-out_200ms_both]",
        FEE_STATUS_FRAME[status.intent],
      )}
    >
      <div className={cn("px-10 py-5", FEE_STATUS_BAND[status.intent])}>
        <p className="text-[52px] leading-tight font-bold tracking-tight">
          {status.label}
        </p>
      </div>

      <div className="px-10 pt-5 pb-6 motion-safe:animate-[attendance-content-up_400ms_ease-out_400ms_both] landscape:pt-4 landscape:pb-5">
        {status.date ? (
          <>
            <p className="text-2xl font-semibold text-neutral-600">
              {status.dateCaption}
            </p>
            <p className="mt-2 text-[28px] leading-tight font-semibold text-neutral-700">
              {formatWeekday(status.date)}
            </p>
            <p className="text-[64px] leading-none font-black tracking-tight text-neutral-900">
              {formatDayMonth(status.date)}
            </p>
            <p className="mt-4 text-[26px] text-neutral-700">
              <span className={cn("font-bold", FEE_STATUS_INK[status.intent])}>
                {status.countdown}
              </span>
              {status.advice && ` · ${status.advice}`}
            </p>
          </>
        ) : (
          <p className="py-2 text-[32px] leading-snug font-semibold text-neutral-900">
            {status.advice}
          </p>
        )}
      </div>
    </section>
  );
}

AttendanceFeeStatus.displayName = "AttendanceFeeStatus";
