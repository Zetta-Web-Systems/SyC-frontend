import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { IdCard } from "lucide-react";
import { Avatar } from "@shared/ui";
import {
  formatDate,
  formatDateToISO,
  formatTimeShort,
} from "@shared/utils/date.utils";
import { PERSON_TYPE, type AttendanceType } from "../../constants";
import type { Attendance } from "../../types";
import { formatAttendanceTime, getDepartureState } from "../../utils";
import { AttendanceDepartureBadge } from "./AttendanceDepartureBadge";
import { AttendanceMoodBadge } from "./AttendanceMoodBadge";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

const nameColumn: ColumnDef<Attendance, unknown> = {
  id: "name",
  header: "Nombre",
  cell: ({ row }) => {
    const { name, lastname, dni, profileImageUrl, personId, type } =
      row.original;
    const initials = (name.charAt(0) + lastname.charAt(0)).toUpperCase();
    const fullName = `${name} ${lastname}`;

    return (
      <div className="flex items-center justify-start gap-4">
        <Avatar
          size="md"
          color="primary"
          src={profileImageUrl ?? null}
          fallback={initials}
          alt={fullName}
        />
        <div className="flex flex-col items-start gap-1">
          <Link
            to="/attendances"
            search={{ type, personId, personName: fullName }}
            className="font-medium hover:text-primary-600 hover:underline"
            title={`Ver asistencias de ${fullName}`}
          >
            {fullName}
          </Link>
          <span className="flex items-center gap-1 justify-center text-xs">
            <IdCard size={12} className="text-primary-400" aria-hidden="true" />
            DNI: {dni}
          </span>
        </div>
      </div>
    );
  },
};

const dateColumn: ColumnDef<Attendance, unknown> = {
  accessorKey: "attendanceDate",
  header: "Fecha",
  cell: ({ row }) => (
    <div className="flex flex-row justify-center gap-1">
      <span className="text-sm">{formatDate(row.original.attendanceDate)}</span>
    </div>
  ),
};

const statusColumn: ColumnDef<Attendance, unknown> = {
  id: "status",
  header: "Estado",
  cell: ({ row }) => <AttendanceStatusBadge isAbsent={row.original.isAbsent} />,
};

const arrivalTimeColumn: ColumnDef<Attendance, unknown> = {
  accessorKey: "arrivalTime",
  header: "Hora de ingreso",
  cell: ({ row }) => {
    const { arrivalTime, isAbsent } = row.original;

    if (isAbsent) return <span>—</span>;

    return <span>{formatAttendanceTime(arrivalTime)}</span>;
  },
};

const departureTimeColumn: ColumnDef<Attendance, unknown> = {
  accessorKey: "departureTime",
  header: "Hora de salida",
  cell: ({ row }) => {
    const { attendanceDate, departureTime, isAbsent } = row.original;

    if (isAbsent) return <span>—</span>;

    if (departureTime) return <span>{formatTimeShort(departureTime)}</span>;

    return (
      <AttendanceDepartureBadge
        state={getDepartureState(attendanceDate, formatDateToISO(new Date()))}
      />
    );
  },
};

const moodColumn: ColumnDef<Attendance, unknown> = {
  accessorKey: "mood",
  header: "Ánimo",
  meta: { className: "whitespace-nowrap" },
  cell: ({ row }) => {
    const { mood } = row.original;

    if (!mood) return <span className="text-neutral-400">—</span>;

    return <AttendanceMoodBadge mood={mood} />;
  },
};

const absentReasonColumn: ColumnDef<Attendance, unknown> = {
  accessorKey: "absentReason",
  header: "Motivo",
  meta: { className: "max-w-64" },
  cell: ({ row }) => {
    const { absentReason, isAbsent } = row.original;

    if (!isAbsent) return <span className="text-neutral-400">—</span>;

    if (!absentReason) {
      return <span className="italic text-neutral-400">Sin motivo</span>;
    }

    return (
      <span
        className="line-clamp-2 text-xs text-neutral-600"
        title={absentReason}
      >
        {absentReason}
      </span>
    );
  },
};

const INSTRUCTOR_COLUMNS: ColumnDef<Attendance, unknown>[] = [
  nameColumn,
  dateColumn,
  arrivalTimeColumn,
  departureTimeColumn,
  moodColumn,
];

const MEMBER_COLUMNS: ColumnDef<Attendance, unknown>[] = [
  nameColumn,
  dateColumn,
  statusColumn,
  arrivalTimeColumn,
  moodColumn,
  absentReasonColumn,
];

export function getAttendanceColumns(
  type: AttendanceType,
): ColumnDef<Attendance, unknown>[] {
  return type === PERSON_TYPE.MEMBER ? MEMBER_COLUMNS : INSTRUCTOR_COLUMNS;
}
