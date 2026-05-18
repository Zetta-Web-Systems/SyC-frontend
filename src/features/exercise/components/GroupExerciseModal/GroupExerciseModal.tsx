import { Modal } from "@shared/ui";
import { GroupExerciseForm } from "../GroupExercisesList/GroupExerciseForm/GroupExerciseForm";
import { useRegisterGroupExerciseMutation } from "../../hooks/mutations/useRegisterGroupExerciseMutation";
import type { ExerciseGroup, RegisterExerciseGroup } from "../../types";
import type { RegisterGroupExerciseSchema } from "../../schemas/groupExercise.schema";

interface GroupExerciseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (group: ExerciseGroup) => void;
  defaultName?: string;
}

export function GroupExerciseModal({
  open,
  onClose,
  onCreated,
  defaultName,
}: GroupExerciseModalProps) {
  const mutation = useRegisterGroupExerciseMutation();

  function handleSubmit(data: RegisterGroupExerciseSchema) {
    mutation.mutate(data as RegisterExerciseGroup, {
      onSuccess: (created) => {
        onCreated(created);
        onClose();
      },
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick
      size="form"
      title="Crear nuevo grupo de ejercicios"
      bodyClassName="p-6"
    >
      {open && (
        <GroupExerciseForm
          defaultName={defaultName}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isPending={mutation.isPending}
          mutation={mutation}
        />
      )}
    </Modal>
  );
}

GroupExerciseModal.displayName = "GroupExerciseModal";
