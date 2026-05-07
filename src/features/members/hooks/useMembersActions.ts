import { useNavigate } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";
import { useDeleteMemberMutation } from "./mutations/useDeleteMemberMutation";
import { useRestoreMemberMutation } from "./mutations/useRestoreMemberMutation";
import type { Member } from "../types";

export function useMembersActions() {
  const navigate = useNavigate();

  const deleteMutation = useDeleteMemberMutation();
  const restoreMutation = useRestoreMemberMutation();

  const handleOpenRegister = () => navigate({ to: "/members/register" });

  const handleOpenProfile = (member: Member) =>
    navigate({
      to: "/members/profile/$memberId",
      params: { memberId: member.id },
    });

  const handleOpenEdit = (member: Member) =>
    navigate({
      to: "/members/update/$memberId",
      params: { memberId: member.id },
    });

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
    handleOpenRegister,
    handleOpenEdit,
    handleOpenProfile,
    handleDelete,
    handleRestore,
  };
}
