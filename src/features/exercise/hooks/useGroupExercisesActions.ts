import { useNavigate } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";
import { useDeleteGroupExerciseMutation } from "./mutations/useDeleteGroupExerciseMutation";
import type { ExerciseGroup } from "../types";

export function useGroupExercisesActions() {
  const navigate = useNavigate();

  const deleteMutation = useDeleteGroupExerciseMutation();

  const handleOpenRegister = () =>
    navigate({ to: "/settings/group-exercises/register" });

  const handleOpenEdit = (group: ExerciseGroup) =>
    navigate({
      to: "/settings/group-exercises/update/$groupExerciseId",
      params: { groupExerciseId: group.id },
    });

  function handleDelete(group: ExerciseGroup) {
    confirm({
      intent: "danger",
      title: "Eliminar grupo de ejercicios",
      description: `¿Estás seguro que deseas eliminar el grupo de ejercicios ${group.name}? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ id: group.id, name: group.name });
      },
    });
  }

  return {
    handleOpenRegister,
    handleOpenEdit,
    handleDelete,
  };
}
