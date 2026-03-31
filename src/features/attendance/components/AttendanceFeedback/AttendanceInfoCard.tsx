import type { ReactNode } from "react";

interface AttendanceInfoCardProps {
  label: string;
  children: ReactNode;
}

export function AttendanceInfoCard({
  label,
  children,
}: AttendanceInfoCardProps) {
  return (
    <div className="flex min-w-36 flex-col items-center gap-2 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur-sm md:min-w-44 md:px-8 md:py-5">
      <span className="text-xs font-semibold uppercase tracking-widest text-white/60 md:text-sm">
        {label}
      </span>
      <div className="text-2xl font-bold text-white md:text-3xl">
        {children}
      </div>
    </div>
  );
}

AttendanceInfoCard.displayName = "AttendanceInfoCard";
