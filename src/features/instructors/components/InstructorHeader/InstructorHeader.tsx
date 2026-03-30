import { Plus, CalendarDays } from "lucide-react";
// import { Link } from "@tanstack/react-router";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface InstructorHeaderProps {
  onCreate: () => void;
}

export function InstructorHeader({ onCreate }: InstructorHeaderProps) {
  return (
    <PageHeader
      title="Profesores"
      description="Administra los profesores del gimnasio"
      actions={
        <>
          {/* <Link to="/instructors/attendance"> */}
          <Button variant="outline" intent="neutral">
            <CalendarDays size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Asistencias</span>
          </Button>
          {/* </Link> */}
          <Button intent="primary" onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Registrar profesor</span>
          </Button>
        </>
      }
    />
  );
}
