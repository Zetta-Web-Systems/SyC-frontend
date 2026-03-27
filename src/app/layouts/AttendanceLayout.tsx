import type { ReactNode } from "react";

interface AttendanceLayoutProps {
  children: ReactNode;
}

export function AttendanceLayout({ children }: AttendanceLayoutProps) {
  return <>{children}</>;
}
