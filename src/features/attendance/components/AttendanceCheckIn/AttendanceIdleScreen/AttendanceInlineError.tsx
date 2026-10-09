import { AlertCircle } from "lucide-react";
import { cn } from "@shared/lib/cn";

interface AttendanceInlineErrorProps {
  error: string | null;
  visible: boolean;
}

export function AttendanceInlineError({
  error,
  visible,
}: AttendanceInlineErrorProps) {
  return (
    <div className="flex min-h-14 items-center justify-center md:min-h-16">
      {visible && error && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border border-error/25 bg-error/10 px-5 py-3",
            "animate-[attendance-shake_500ms_ease-in-out]",
          )}
          role="alert"
        >
          <AlertCircle className="size-5 shrink-0 text-error" />
          <p className="text-sm font-medium text-error md:text-base">{error}</p>
        </div>
      )}
    </div>
  );
}

AttendanceInlineError.displayName = "AttendanceInlineError";
