interface AttendanceProgressBarProps {
  duration: number;
}

export function AttendanceProgressBar({
  duration,
}: AttendanceProgressBarProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20">
      <div
        className="h-full w-full origin-left bg-white/60 animate-[attendance-progress_linear_forwards]"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

AttendanceProgressBar.displayName = "AttendanceProgressBar";
