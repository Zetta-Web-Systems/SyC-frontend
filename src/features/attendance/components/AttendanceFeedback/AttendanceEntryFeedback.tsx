import { CircleCheckBig } from "lucide-react";
import type { AttendanceResponse } from "../../types";
import { FALLBACK_MESSAGES, PERSON_TYPE_LABELS } from "../../constants";

interface AttendanceEntryFeedbackProps {
  response: AttendanceResponse;
}

export function AttendanceEntryFeedback({
  response,
}: AttendanceEntryFeedbackProps) {
  const fullName = `${response.name} ${response.lastname}`;
  const typeLabel = PERSON_TYPE_LABELS[response.type] ?? response.type;
  const message =
    response.message ??
    FALLBACK_MESSAGES.entry(response.name, response.lastname);

  return (
    <div className="flex flex-col items-center gap-5 text-center md:gap-6">
      <div className="animate-[attendance-icon-bounce_500ms_ease-out_200ms_both]">
        <CircleCheckBig
          className="h-16 w-16 text-white md:h-20 md:w-20"
          strokeWidth={1.5}
        />
      </div>

      <div
        className="animate-[attendance-content-up_400ms_ease-out_both]"
        style={{ animationDelay: "400ms" }}
      >
        <h2 className="text-4xl font-bold text-white md:text-5xl">
          {fullName}
        </h2>
      </div>

      <div
        className="animate-[attendance-content-up_400ms_ease-out_both]"
        style={{ animationDelay: "480ms" }}
      >
        <span className="text-lg font-medium uppercase tracking-wide text-white/70">
          {typeLabel}
        </span>
      </div>

      <div
        className="animate-[attendance-content-up_400ms_ease-out_both]"
        style={{ animationDelay: "560ms" }}
      >
        <p className="max-w-md text-2xl text-white/90 md:max-w-lg md:text-3xl">
          {message}
        </p>
      </div>

      <div
        className="animate-[attendance-content-up_400ms_ease-out_both]"
        style={{ animationDelay: "640ms" }}
      >
        <span className="text-lg text-white/60">{response.arrivalTime}</span>
      </div>
    </div>
  );
}

AttendanceEntryFeedback.displayName = "AttendanceEntryFeedback";
