import { Modal } from "@shared/ui";
import type { MutationLike } from "@shared/types/mutations.types";
import { InstructorForm } from "../InstructorForm/InstructorForm";
import type { Instructor } from "../../types";
import type { RegisterInstructorSchema } from "../../schemas/instructor.schema";
import type { UpdateInstructorSchema } from "../../schemas/instructor.schema";

interface InstructorFormModalBaseProps {
  open: boolean;
  mutation: MutationLike;
  isPending: boolean;
  onClose: () => void;
}

interface InstructorFormModalCreateProps extends InstructorFormModalBaseProps {
  instructor?: undefined;
  onSubmit: (data: RegisterInstructorSchema) => void;
}

interface InstructorFormModalEditProps extends InstructorFormModalBaseProps {
  instructor: Instructor;
  onSubmit: (data: UpdateInstructorSchema) => void;
}

type InstructorFormModalProps =
  | InstructorFormModalCreateProps
  | InstructorFormModalEditProps;

export function InstructorFormModal({
  open,
  mutation,
  isPending,
  onClose,
  instructor,
  onSubmit,
}: InstructorFormModalProps) {
  const isEditing = !!instructor;
  const title = isEditing ? "Editar profesor" : "Registrar profesor";

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      title={title}
      bodyClassName="p-6"
    >
      {open &&
        (isEditing ? (
          <InstructorForm
            key={instructor.id}
            instructor={instructor}
            onSubmit={onSubmit as (data: UpdateInstructorSchema) => void}
            isPending={isPending}
            mutation={mutation}
          />
        ) : (
          <InstructorForm
            key="create"
            onSubmit={onSubmit as (data: RegisterInstructorSchema) => void}
            isPending={isPending}
            mutation={mutation}
          />
        ))}
    </Modal>
  );
}

InstructorFormModal.displayName = "InstructorFormModal";
