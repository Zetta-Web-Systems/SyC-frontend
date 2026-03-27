import { CircleX } from "lucide-react";

interface AttendanceErrorFeedbackProps {
  error: string;
}

export function AttendanceErrorFeedback({
  error,
}: AttendanceErrorFeedbackProps) {
  return (
    <div className="animate-[attendance-shake_500ms_ease-in-out_700ms_both]">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="animate-[attendance-icon-bounce_500ms_ease-out_200ms_both]">
          <CircleX size={72} className="text-white" strokeWidth={1.5} />
        </div>

        <div
          className="animate-[attendance-content-up_400ms_ease-out_both]"
          style={{ animationDelay: "400ms" }}
        >
          <h2 className="text-4xl font-bold text-white">Error</h2>
        </div>

        <div
          className="animate-[attendance-content-up_400ms_ease-out_both]"
          style={{ animationDelay: "480ms" }}
        >
          <p className="max-w-md text-2xl text-white/90">{error}</p>
        </div>

        <div
          className="animate-[attendance-content-up_400ms_ease-out_both]"
          style={{ animationDelay: "560ms" }}
        >
          <span className="text-lg text-white/60">Intenta de nuevo</span>
        </div>
      </div>
    </div>
  );
}

AttendanceErrorFeedback.displayName = "AttendanceErrorFeedback";
