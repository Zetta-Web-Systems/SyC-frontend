import { CalendarDays, IdCard } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { formatDate, formatTimeShort } from "@shared/utils/date.utils";
import { PERSON_TYPE_SINGULAR_LABELS } from "../../constants";
import type { Attendance } from "../../types";

interface AttendanceCardProps {
  attendance: Attendance;
}

export function AttendanceCard({ attendance }: AttendanceCardProps) {
  const fullName = `${attendance.name} ${attendance.lastname}`;
  const initials = (
    attendance.name.charAt(0) + attendance.lastname.charAt(0)
  ).toUpperCase();

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-4">
        <Avatar size="md" color="primary" fallback={initials} alt={fullName} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {fullName}
            </p>
            <Badge
              intent={attendance.type === "INSTRUCTOR" ? "info" : "neutral"}
              size="sm"
            >
              {PERSON_TYPE_SINGULAR_LABELS[attendance.type]}
            </Badge>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <IdCard
                size={12}
                className="text-primary-400"
                aria-hidden="true"
              />
              <span>DNI: {attendance.dni}</span>
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays
                size={12}
                className="text-neutral-400"
                aria-hidden="true"
              />
              <span>{formatDate(attendance.attendanceDate)}</span>
            </span>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden gap-6 sm:flex sm:ml-auto">
          <div className="flex w-16 flex-col items-center">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              Ingreso
            </span>
            <span className="text-sm font-semibold text-neutral-900">
              {formatTimeShort(attendance.arrivalTime)}
            </span>
          </div>

          <div className="flex w-20 flex-col items-center">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              Salida
            </span>
            {attendance.departureTime ? (
              <span className="text-sm font-semibold text-neutral-900">
                {formatTimeShort(attendance.departureTime)}
              </span>
            ) : (
              <Badge variant="dot" intent="success" size="md">
                En curso
              </Badge>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="ml-auto flex flex-col items-center gap-0.5 sm:hidden">
          <span className="text-xs font-semibold text-neutral-900">
            {formatTimeShort(attendance.arrivalTime)}
          </span>
          <div className="flex flex-col items-center">
            <div className="h-2 w-px bg-primary-300" />
            <div className="size-2 rounded-full border-2 border-primary-500 bg-white" />
            <div className="h-2 w-px bg-neutral-300" />
          </div>
          {attendance.departureTime ? (
            <span className="text-xs font-semibold text-neutral-900">
              {formatTimeShort(attendance.departureTime)}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-success">
              En curso
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

AttendanceCard.displayName = "AttendanceCard";
