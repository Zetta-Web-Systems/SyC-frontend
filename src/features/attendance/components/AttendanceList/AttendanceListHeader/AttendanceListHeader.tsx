import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { Button } from "@shared/ui";
import { PERSON_TYPE_LABELS, type AttendanceType } from "../../../constants";

interface AttendanceListHeaderProps {
  type: AttendanceType;
}

export function AttendanceListHeader({ type }: AttendanceListHeaderProps) {
  return (
    <PageHeader
      title={`Asistencias - ${PERSON_TYPE_LABELS[type]}`}
      description={`Administra las asistencias de los ${PERSON_TYPE_LABELS[type].toLowerCase()} del gimnasio`}
      actions={
        <>
          <Link to="/instructors">
            <Button variant="outline" intent="neutral">
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="hidden xs:inline">Volver</span>
            </Button>
          </Link>
          {/* <Link to="/attendances/members" search={{ type: "MEMBER" as const }}> */}
          <Button variant="outline" intent="neutral">
            <CalendarDays size={16} aria-hidden="true" />
            <span className="hidden xs:inline">
              Asistencias de {PERSON_TYPE_LABELS["MEMBER"]}
            </span>
          </Button>
          {/* </Link> */}
        </>
      }
    />
  );
}
