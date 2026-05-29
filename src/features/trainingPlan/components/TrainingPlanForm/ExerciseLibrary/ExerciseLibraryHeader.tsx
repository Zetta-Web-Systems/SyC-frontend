import { X } from "lucide-react";
import { IconButton } from "@shared/ui";

interface ExerciseLibraryHeaderProps {
  onClose: () => void;
}

export function ExerciseLibraryHeader({ onClose }: ExerciseLibraryHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
      <div>
        <h2 className="m-0 text-sm font-bold text-neutral-900">Biblioteca</h2>
        <p className="text-xs text-neutral-500">
          Arrastrá un ejercicio al día o tocá el +
        </p>
      </div>
      <IconButton size="sm" aria-label="Cerrar" onClick={onClose}>
        <X size={18} aria-hidden="true" />
      </IconButton>
    </header>
  );
}

ExerciseLibraryHeader.displayName = "ExerciseLibraryHeader";
