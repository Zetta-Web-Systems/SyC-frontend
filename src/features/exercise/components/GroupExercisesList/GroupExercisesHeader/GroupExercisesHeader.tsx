import { ArrowLeft, Dumbbell, Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface GroupExercisesHeaderProps {
  onCreate: () => void;
  onBack: () => void;
  onGoToExercises: () => void;
}

export function GroupExercisesHeader({
  onCreate,
  onBack,
  onGoToExercises,
}: GroupExercisesHeaderProps) {
  return (
    <PageHeader
      title="Grupos de ejercicios"
      description="Administra los grupos de ejercicios"
      actions={
        <>
          <Button intent="neutral" variant="outline" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver a Configuración</span>
          </Button>
          <Button intent="neutral" variant="outline" onClick={onGoToExercises}>
            <Dumbbell size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Ejercicios</span>
          </Button>
          <Button intent="primary" onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            <span className="hidden xs:inline">
              Registrar grupo de ejercicios
            </span>
          </Button>
        </>
      }
    />
  );
}
