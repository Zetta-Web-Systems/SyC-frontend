import { Modal } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import { useActiveVideo } from "@features/exercise";
import type { Exercise } from "@features/exercise";
import { ExerciseQuickViewContent } from "./ExerciseQuickView/ExerciseQuickViewContent";

interface ExerciseQuickViewProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export function ExerciseQuickView({
  exercise,
  onClose,
}: ExerciseQuickViewProps) {
  const open = exercise !== null;
  const bodyDetailModal = useDisclosure();
  const videoSelection = useActiveVideo(exercise?.links);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick
      size="lg"
      title={exercise?.name ?? "Ejercicio"}
      bodyClassName="px-5 py-4"
    >
      {exercise && (
        <ExerciseQuickViewContent
          exercise={exercise}
          videoSelection={videoSelection}
          bodyDetailModal={bodyDetailModal}
        />
      )}
    </Modal>
  );
}

ExerciseQuickView.displayName = "ExerciseQuickView";
