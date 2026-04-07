import { Modal } from "@shared/ui";
import type { MutationLike } from "@shared/types/mutations.types";
import { MemberForm } from "../MemberForm/MemberForm";
import type { Member } from "../../../types";
import type {
  RegisterMemberSchema,
  UpdateMemberSchema,
} from "../../../schemas/member.schema";

interface MemberFormModalBaseProps {
  open: boolean;
  mutation: MutationLike;
  isPending: boolean;
  onClose: () => void;
}

interface MemberFormModalCreateProps extends MemberFormModalBaseProps {
  member?: undefined;
  onSubmit: (data: RegisterMemberSchema) => void;
}

interface MemberFormModalEditProps extends MemberFormModalBaseProps {
  member: Member;
  onSubmit: (data: UpdateMemberSchema) => void;
}

type MemberFormModalProps =
  | MemberFormModalCreateProps
  | MemberFormModalEditProps;

export function MemberFormModal({
  open,
  mutation,
  isPending,
  onClose,
  member,
  onSubmit,
}: MemberFormModalProps) {
  const isEditing = !!member;
  const title = isEditing ? "Editar alumno" : "Registrar alumno";

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
          <MemberForm
            key={member.id}
            member={member}
            onSubmit={onSubmit as (data: UpdateMemberSchema) => void}
            isPending={isPending}
            mutation={mutation}
          />
        ) : (
          <MemberForm
            key="create"
            onSubmit={onSubmit as (data: RegisterMemberSchema) => void}
            isPending={isPending}
            mutation={mutation}
          />
        ))}
    </Modal>
  );
}

MemberFormModal.displayName = "MemberFormModal";
