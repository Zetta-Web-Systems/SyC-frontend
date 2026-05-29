import { BookMarked } from "lucide-react";
import { Fab } from "@shared/ui";

interface ExerciseLibraryFABProps {
  onClick: () => void;
  count?: number;
}

export function ExerciseLibraryFAB({
  onClick,
  count,
}: ExerciseLibraryFABProps) {
  return (
    <Fab
      onClick={onClick}
      shape="extended"
      aria-label="Abrir biblioteca de ejercicios"
      icon={<BookMarked size={18} aria-hidden="true" />}
      badge={count}
      positionClassName="fixed right-6 bottom-24"
    >
      Biblioteca
    </Fab>
  );
}

ExerciseLibraryFAB.displayName = "ExerciseLibraryFAB";
