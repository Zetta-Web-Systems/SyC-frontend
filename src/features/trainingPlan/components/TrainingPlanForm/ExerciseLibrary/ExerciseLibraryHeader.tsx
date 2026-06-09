import { Plus, X } from "lucide-react";
import { Button, IconButton } from "@shared/ui";

interface ExerciseLibraryHeaderProps {
  onClose: () => void;
  onCreate: () => void;
}

export function ExerciseLibraryHeader({
  onClose,
  onCreate,
}: ExerciseLibraryHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
      <div className="min-w-0">
        <h2 className="m-0 text-sm font-bold text-neutral-900">Biblioteca</h2>
        <p className="text-xs text-neutral-500">Arrastrá o tocá el +</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button intent="primary" size="sm" variant="outline" onClick={onCreate}>
          <Plus size={14} aria-hidden="true" />
          <span className="hidden xs:inline">Crear ejercicio</span>
        </Button>
        <IconButton size="sm" aria-label="Cerrar" onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </IconButton>
      </div>
    </header>
  );
}

ExerciseLibraryHeader.displayName = "ExerciseLibraryHeader";
