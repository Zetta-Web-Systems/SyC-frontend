import { Plus, CalendarDays } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface MembersHeaderProps {
  onCreate: () => void;
}

export function MembersHeader({ onCreate }: MembersHeaderProps) {
  return (
    <PageHeader
      title="Alumnos"
      description="Administra los alumnos del gimnasio"
      actions={
        <>
          <Link to="/attendances" search={{ type: "MEMBER" as const }}>
            <Button variant="outline" intent="neutral">
              <CalendarDays size={16} aria-hidden="true" />
              <span className="hidden xs:inline">Asistencias</span>
            </Button>
          </Link>
          <Button intent="primary" onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Registrar alumno</span>
          </Button>
        </>
      }
    />
  );
}
