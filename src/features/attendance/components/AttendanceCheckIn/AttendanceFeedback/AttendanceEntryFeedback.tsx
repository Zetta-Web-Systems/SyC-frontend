import { CircleCheckBig } from "lucide-react";
import { AttendanceInfoCard } from "./AttendanceInfoCard";
import type { AttendanceResponse } from "../../../types";
import { FALLBACK_MESSAGES } from "../../../constants";

interface AttendanceEntryFeedbackProps {
  response: AttendanceResponse;
}

export function AttendanceEntryFeedback({
  response,
}: AttendanceEntryFeedbackProps) {
  const subtitle = FALLBACK_MESSAGES.entry();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="animate-[attendance-icon-bounce_500ms_ease-out_both]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm md:h-24 md:w-24">
          <CircleCheckBig
            className="h-10 w-10 text-white md:h-12 md:w-12"
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div
        className="mt-3 animate-[attendance-content-up_400ms_ease-out_both] md:mt-4"
        style={{ animationDelay: "700ms" }}
      >
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
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
        <AttendanceInfoCard label="Hora de entrada">
          {response.arrivalTime}
        </AttendanceInfoCard>
      </div>
    </div>
  );
}

AttendanceEntryFeedback.displayName = "AttendanceEntryFeedback";
