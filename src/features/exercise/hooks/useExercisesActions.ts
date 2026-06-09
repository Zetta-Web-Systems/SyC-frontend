import { useNavigate } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";
import { useDeleteExerciseMutation } from "./mutations/useDeleteExerciseMutation";
import { useDeletePhysicalExerciseMutation } from "./mutations/useDeletePhysicalExerciseMutation";
import { useRestoreExerciseMutation } from "./mutations/useRestoreExerciseMutation";
import type { Exercise } from "../types";

export function useExercisesActions(groupId: string) {
  const navigate = useNavigate();

  const deleteMutation = useDeleteExerciseMutation();
  const physicalDeleteMutation = useDeletePhysicalExerciseMutation();
  const restoreMutation = useRestoreExerciseMutation();

  const handleOpenRegister = () =>
    navigate({
      to: "/exercises/register",
      search: { groupId },
    });

  const handleOpenEdit = (exercise: Exercise) =>
    navigate({
      to: "/exercises/$groupId/update/$exerciseId",
      params: { groupId, exerciseId: exercise.id },
    });

  const handleOpenProfile = (exercise: Exercise) =>
    navigate({
      to: "/exercises/$groupId/profile/$exerciseId",
      params: { groupId, exerciseId: exercise.id },
    });

  function handleSoftDelete(exercise: Exercise) {
    confirm({
      intent: "warning",
      title: "Desactivar ejercicio",
      description: `¿Estás seguro que deseas desactivar el ejercicio "${exercise.name}"? Podrás restaurarlo más tarde.`,
      confirmLabel: "Desactivar",
      onConfirm: () => {
        deleteMutation.mutate({ id: exercise.id, name: exercise.name });
      },
    });
  }

  function handlePhysicalDelete(exercise: Exercise) {
    confirm({
      intent: "danger",
      title: "Eliminar ejercicio definitivamente",
      description: `¿Estás seguro que deseas eliminar definitivamente el ejercicio "${exercise.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar definitivamente",
      onConfirm: () => {
        physicalDeleteMutation.mutate({ id: exercise.id, name: exercise.name });
      },
    });
  }

  function handleRestore(exercise: Exercise) {
    confirm({
      intent: "info",
      title: "Restaurar ejercicio",
      description: `¿Estás seguro que deseas restaurar el ejercicio "${exercise.name}"?`,
      confirmLabel: "Restaurar",
      onConfirm: () => {
        restoreMutation.mutate({ id: exercise.id, name: exercise.name });
      },
    });
  }

  return {
    handleOpenRegister,
    handleOpenEdit,
    handleOpenProfile,
    handleSoftDelete,
    handlePhysicalDelete,
    handleRestore,
  };
}
