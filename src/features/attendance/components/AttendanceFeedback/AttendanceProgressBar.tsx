interface AttendanceProgressBarProps {
  duration: number;
}

export function AttendanceProgressBar({
  duration,
}: AttendanceProgressBarProps) {
  return (
    <div className="mt-10 h-1.5 w-full max-w-md rounded-full bg-white/20 md:mt-12 md:max-w-lg">
      <div
        className="h-full w-full origin-left rounded-full bg-white/60 animate-[attendance-progress_linear_forwards]"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

AttendanceProgressBar.displayName = "AttendanceProgressBar";
