import { KIOSK_LOGO_SRC } from "../../../constants";
import { useNow } from "../../../hooks/checkIn/useNow";
import { formatClockTime, formatKioskDate } from "../../../utils/checkIn.utils";

export function AttendanceCheckInHeader() {
  const now = useNow();

  return (
    <header className="flex shrink-0 items-start justify-between gap-8 px-14 pt-7">
      <img
        src={KIOSK_LOGO_SRC}
        alt="Sano y Controlado"
        className="mt-1 h-12 w-auto object-contain"
      />
      <div className="text-right">
        <p className="text-[44px] leading-none font-semibold text-neutral-900 tabular-nums">
          {formatClockTime(now)}
        </p>
        <p className="mt-2 text-2xl text-neutral-600">{formatKioskDate(now)}</p>
      </div>
    </header>
  );
}

AttendanceCheckInHeader.displayName = "AttendanceCheckInHeader";
