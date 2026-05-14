import { Hand } from "lucide-react";
import { formatDuration, formatTimeShort } from "@shared/utils/date.utils";
import { AttendanceInfoCard } from "./AttendanceInfoCard";
import { FALLBACK_MESSAGES } from "../../../constants";
import type { AttendanceCheckIn } from "../../../types";

interface AttendanceExitFeedbackProps {
  response: AttendanceCheckIn;
}

export function AttendanceExitFeedback({
  response,
}: AttendanceExitFeedbackProps) {
  const subtitle = FALLBACK_MESSAGES.exit();

  const duration = response.departureTime
    ? formatDuration(response.arrivalTime, response.departureTime)
    : null;

  const arrivalShort = formatTimeShort(response.arrivalTime);
  const departureShort = response.departureTime
    ? formatTimeShort(response.departureTime)
    : null;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="animate-[attendance-icon-bounce_500ms_ease-out_both]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm md:h-24 md:w-24">
          <div
            className="animate-[attendance-wave_600ms_ease-in-out_both]"
            style={{ animationDelay: "900ms" }}
          >
            <Hand
              className="h-10 w-10 text-white md:h-12 md:w-12"
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>

      <div
        className="mt-3 animate-[attendance-content-up_400ms_ease-out_both] md:mt-4"
        style={{ animationDelay: "700ms" }}
      >
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {response.message}
        </h2>
      </div>

      <div
        className="mt-3 animate-[attendance-content-up_400ms_ease-out_both]"
        style={{ animationDelay: "850ms" }}
      >
        <p className="max-w-md text-lg text-white/80 md:max-w-lg md:text-xl">
          {subtitle}
        </p>
      </div>

      <div
        className="mt-8 flex gap-4 animate-[attendance-card-up_450ms_ease-out_both] md:mt-10 md:gap-6"
        style={{ animationDelay: "1000ms" }}
      >
        {duration && (
          <AttendanceInfoCard label="Duración total">
            {duration}
          </AttendanceInfoCard>
        )}

        {departureShort && (
          <AttendanceInfoCard label="Registro de tiempo">
            <span className="flex items-center gap-2">
              {arrivalShort}
              <span className="text-lg text-white/50">&rarr;</span>
              {departureShort}
            </span>
          </AttendanceInfoCard>
        )}
      </div>
    </div>
  );
}

AttendanceExitFeedback.displayName = "AttendanceExitFeedback";
