import { useState } from "react";
import { confirm } from "@shared/stores/confirm.store";
import { useRegisterMemberMutation } from "./mutations/useRegisterMemberMutation";
import { useUpdateMemberMutation } from "./mutations/useUpdateMemberMutation";
import { useDeleteMemberMutation } from "./mutations/useDeleteMemberMutation";
import { useRestoreMemberMutation } from "./mutations/useRestoreMemberMutation";
import type {
  RegisterMemberSchema,
  UpdateMemberSchema,
} from "../schemas/member.schema";
import type { Member } from "../types";

export function useMembersActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const registerMutation = useRegisterMemberMutation();
  const updateMutation = useUpdateMemberMutation();
  const deleteMutation = useDeleteMemberMutation();
  const restoreMutation = useRestoreMemberMutation();

  const activeMutation = editingMember ? updateMutation : registerMutation;

  function handleOpenRegister() {
    setEditingMember(null);
    setModalOpen(true);
  }

  function handleOpenEdit(member: Member) {
    setEditingMember(member);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingMember(null);
    registerMutation.reset();
    updateMutation.reset();
  }

  function handleRegister(data: RegisterMemberSchema) {
    confirm({
      intent: "info",
      title: "Registrar alumno",
      description: `¿Estas seguro que deseas registrar el alumno?`,
      confirmLabel: "Registrar",
      onConfirm: () => {
        const normalized = {
          ...data,
          image: data.image ?? undefined,
          currentWeight: data.currentWeight ?? undefined,
        };
        registerMutation.mutate(normalized, {
          onSuccess: () => handleCloseModal(),
        });
      },
    });
  }

  function handleUpdate(data: UpdateMemberSchema) {
    if (!editingMember) return;
    if (Object.keys(data).length === 0) {
      handleCloseModal();
      return;
    }
    confirm({
      intent: "warning",
      title: "Modificar alumno",
      description: `¿Estas seguro que deseas modificar a ${editingMember.name} ${editingMember.lastname}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        const { deleteImage, ...rest } = data;
        const normalized: Record<string, unknown> = {
          ...rest,
          image: rest.image ?? undefined,
        };

        if (deleteImage) {
          normalized.deleteImage = true;
          delete normalized.image;
        }

        updateMutation.mutate(
          { id: editingMember.id, dto: normalized },
          { onSuccess: () => handleCloseModal() },
        );
      },
    });
  }

  function handleDelete(member: Member) {
    confirm({
      intent: "danger",
      title: "Eliminar alumno",
      description: `¿Estas seguro que deseas eliminar a ${member.name} ${member.lastname}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ id: member.id });
      },
    });
  }

  function handleRestore(member: Member) {
    confirm({
      intent: "warning",
      title: "Restaurar alumno",
      description: `¿Estas seguro que deseas restaurar a ${member.name} ${member.lastname}?`,
      confirmLabel: "Restaurar",
      onConfirm: () => {
        restoreMutation.mutate({ id: member.id });
      },
    });
  }

  return {
    modalOpen,
    editingMember,
    isPending: activeMutation.isPending,
    activeMutation,
    handleOpenRegister,
    handleOpenEdit,
    handleCloseModal,
    handleRegister,
    handleUpdate,
    handleDelete,
    handleRestore,
  };
}
