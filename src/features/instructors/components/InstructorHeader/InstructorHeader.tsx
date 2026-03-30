import { Plus } from "lucide-react";
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
        <Button intent="primary" onClick={onCreate}>
          <Plus size={16} aria-hidden="true" />
          <span className="hidden xs:inline">Registrar profesor</span>
        </Button>
      }
    />
  );
}
