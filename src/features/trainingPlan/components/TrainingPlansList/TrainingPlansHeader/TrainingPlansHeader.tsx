import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface TrainingPlansHeaderProps {
  onCreate: () => void;
}

export function TrainingPlansHeader({ onCreate }: TrainingPlansHeaderProps) {
  return (
    <PageHeader
      title="Planificaciones"
      description="Administra las planificaciones de entrenamiento de los alumnos"
      actions={
        <Button intent="primary" onClick={onCreate}>
          <Plus size={16} aria-hidden="true" />
          <span className="hidden xs:inline">Registrar planificación</span>
        </Button>
      }
    />
  );
}

TrainingPlansHeader.displayName = "TrainingPlansHeader";
