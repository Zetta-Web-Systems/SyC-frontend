import { Modal } from "@shared/ui";
import { InstructorForm } from "../InstructorForm/InstructorForm";
import { useCreateInstructorMutation } from "../../hooks/useCreateInstructorMutation";
import { useUpdateInstructorMutation } from "../../hooks/useUpdateInstructorMutation";
import type { Instructor } from "../../types";
import type { CreateInstructorSchema } from "../../schemas/instructor.schema";
import type { UpdateInstructorSchema } from "../../schemas/instructor.schema";

interface InstructorFormModalProps {
  open: boolean;
  onClose: () => void;
  instructor?: Instructor;
}

export function InstructorFormModal({
  open,
  onClose,
  instructor,
}: InstructorFormModalProps) {
  const createMutation = useCreateInstructorMutation();
  const updateMutation = useUpdateInstructorMutation();

  const isEditing = !!instructor;

  function handleCreateSubmit(data: CreateInstructorSchema) {
    createMutation.mutate(data, {
      onSuccess: () => onClose(),
    });
  }

  function handleEditSubmit(data: UpdateInstructorSchema) {
    if (!instructor) return;
    updateMutation.mutate(
      { id: instructor.id, dto: data },
      { onSuccess: () => onClose() },
    );
  }

  const title = isEditing ? "Editar profesor" : "Crear profesor";

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-neutral-900">{title}</h2>

        {isEditing ? (
          <InstructorForm
            instructor={instructor}
            onSubmit={handleEditSubmit}
            isPending={updateMutation.isPending}
            mutation={updateMutation}
          />
        ) : (
          <InstructorForm
            onSubmit={handleCreateSubmit}
            isPending={createMutation.isPending}
            mutation={createMutation}
          />
        )}
      </div>
    </Modal>
  );
}

InstructorFormModal.displayName = "InstructorFormModal";
