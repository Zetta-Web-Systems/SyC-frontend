import { Card } from "@shared/ui";
import type { Exercise } from "../../../types";

interface ExerciseProfileNotesProps {
  exercise: Exercise;
}

export function ExerciseProfileNotes({ exercise }: ExerciseProfileNotesProps) {
  const hasNotes = Boolean(exercise.notes && exercise.notes.trim().length > 0);

  if (!hasNotes) return null;

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-2">
        <h6 className="text-neutral-500">Notas</h6>
        <p className="whitespace-pre-line text-sm text-neutral-900">
          {exercise.notes}
        </p>
      </div>
    </Card>
  );
}

ExerciseProfileNotes.displayName = "ExerciseProfileNotes";
