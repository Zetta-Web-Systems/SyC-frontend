import { Plus } from "lucide-react";
import { Button } from "@shared/ui";

interface InstructorHeaderProps {
  onCreate: () => void;
}

export function InstructorHeader({ onCreate }: InstructorHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1>Profesores</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Administra los profesores del gimnasio
        </p>
      </div>
      <Button intent="primary" onClick={onCreate}>
        <Plus size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Crear profesor</span>
      </Button>
    </div>
  );
}
