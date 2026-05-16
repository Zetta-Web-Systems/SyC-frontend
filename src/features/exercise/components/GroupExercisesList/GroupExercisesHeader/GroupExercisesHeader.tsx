import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface GroupExercisesHeaderProps {
  onCreate: () => void;
}

export function GroupExercisesHeader({ onCreate }: GroupExercisesHeaderProps) {
  return (
    <PageHeader
      title="Grupos de ejercicios"
      description="Administra los grupos de ejercicios"
      actions={
        <>
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
