import { Link } from "@tanstack/react-router";
import { CalendarDays, IdCard } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import {
  formatDate,
  formatDateToISO,
  formatTimeShort,
} from "@shared/utils/date.utils";
import {
  PERSON_TYPE_INTENT,
  PERSON_TYPE_SINGULAR_LABELS,
} from "../../constants";
import type { Attendance } from "../../types";
import {
  formatAttendanceTime,
  getDepartureState,
  registersDeparture,
} from "../../utils";
import { AttendanceDepartureBadge } from "./AttendanceDepartureBadge";
import { AttendanceMoodBadge } from "./AttendanceMoodBadge";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

interface AttendanceCardProps {
  attendance: Attendance;
}

export function AttendanceCard({ attendance }: AttendanceCardProps) {
  const fullName = `${attendance.name} ${attendance.lastname}`;
  const initials = (
    attendance.name.charAt(0) + attendance.lastname.charAt(0)
  ).toUpperCase();
  const hasDeparture = registersDeparture(attendance.type);
  const departureState = getDepartureState(
    attendance.attendanceDate,
    formatDateToISO(new Date()),
  );

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-4">
        <Avatar
          size="md"
          color="primary"
          src={attendance.profileImageUrl ?? null}
          fallback={initials}
          alt={fullName}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to="/attendances"
              search={{
                type: attendance.type,
                personId: attendance.personId,
                personName: fullName,
              }}
              className="truncate text-sm font-semibold text-neutral-900 hover:text-primary-600 hover:underline"
              title={`Ver asistencias de ${fullName}`}
            >
              {fullName}
            </Link>
            <Badge intent={PERSON_TYPE_INTENT[attendance.type]} size="sm">
              {PERSON_TYPE_SINGULAR_LABELS[attendance.type]}
            </Badge>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
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
            {attendance.mood && (
              <AttendanceMoodBadge mood={attendance.mood} size="sm" />
            )}
          </div>

          {attendance.isAbsent &&
            (attendance.absentReason ? (
              <p
                className="mt-1.5 line-clamp-2 text-xs text-neutral-600"
                title={attendance.absentReason}
              >
                {attendance.absentReason}
              </p>
            ) : (
              <p className="mt-1.5 text-xs italic text-neutral-400">
                Sin motivo
              </p>
            ))}
        </div>

        {attendance.isAbsent ? (
          <div className="ml-auto flex shrink-0 flex-col items-center gap-1">
            <AttendanceStatusBadge isAbsent />
            <span className="text-xs font-semibold text-neutral-900">
              {formatAttendanceTime(attendance.arrivalTime)}
            </span>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden gap-6 sm:flex sm:ml-auto">
              <div className="flex w-16 flex-col items-center">
                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                  Ingreso
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {formatAttendanceTime(attendance.arrivalTime)}
                </span>
              </div>

              {hasDeparture && (
                <div className="flex w-24 flex-col items-center">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                    Salida
                  </span>
                  {attendance.departureTime ? (
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatTimeShort(attendance.departureTime)}
                    </span>
                  ) : (
                    <AttendanceDepartureBadge state={departureState} />
                  )}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="ml-auto flex flex-col items-center gap-0.5 sm:hidden">
              {hasDeparture ? (
                <>
                  <span className="text-xs font-semibold text-neutral-900">
                    {formatAttendanceTime(attendance.arrivalTime)}
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
                    <AttendanceDepartureBadge
                      state={departureState}
                      size="sm"
                    />
                  )}
                </>
              ) : (
                <>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                    Ingreso
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {formatAttendanceTime(attendance.arrivalTime)}
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

AttendanceCard.displayName = "AttendanceCard";
