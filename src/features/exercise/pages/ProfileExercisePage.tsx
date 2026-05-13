import { Spinner } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import { ExerciseProfile } from "../components/ExerciseProfile/ExerciseProfile";
import { useExerciseQuery } from "../hooks/useExerciseQuery";
import { useExercisesActions } from "../hooks/useExercisesActions";
import { useActiveVideo } from "../hooks/useActiveVideo";

interface ProfileExercisePageProps {
  groupId: string;
  exerciseId: string;
}

export default function ProfileExercisePage({
  groupId,
  exerciseId,
}: ProfileExercisePageProps) {
  const { data: exercise, isLoading, isError } = useExerciseQuery(exerciseId);
  const { handleOpenEdit } = useExercisesActions(groupId);

  const bodyDetailModal = useDisclosure();
  const videoSelection = useActiveVideo(exercise?.links);

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <p
          role="alert"
          className="rounded-xl border border-error bg-error/5 p-4 text-sm text-error"
        >
          No se pudo cargar el ejercicio.
        </p>
      )}

      {exercise && (
        <ExerciseProfile
          exercise={exercise}
          groupId={groupId}
          onEdit={handleOpenEdit}
          bodyDetailModal={bodyDetailModal}
          videoSelection={videoSelection}
        />
      )}
    </div>
  );
}
