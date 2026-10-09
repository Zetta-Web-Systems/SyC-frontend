import { Spinner } from "@shared/ui";

export function AttendanceLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-white/85 backdrop-blur-sm motion-safe:animate-[attendance-feedback-in_200ms_ease-out_both]">
      <Spinner size="lg" className="h-20 w-20 border-6" />
      <p className="text-[44px] font-bold text-neutral-900">Un momento…</p>
    </div>
  );
}

AttendanceLoadingOverlay.displayName = "AttendanceLoadingOverlay";
