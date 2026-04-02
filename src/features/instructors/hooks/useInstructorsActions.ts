import { useState } from "react";
import { confirm } from "@shared/stores/confirm.store";
import { useRegisterInstructorMutation } from "./mutations/useRegisterInstructorMutation";
import { useUpdateInstructorMutation } from "./mutations/useUpdateInstructorMutation";
import { useDeleteInstructorMutation } from "./mutations/useDeleteInstructorMutation";
import { useRestoreInstructorMutation } from "./mutations/useRestoreInstructorMutation";
import type {
  RegisterInstructorSchema,
  UpdateInstructorSchema,
} from "../schemas/instructor.schema";
import type { Instructor } from "../types";

export function useInstructorsActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );

  const registerMutation = useRegisterInstructorMutation();
  const updateMutation = useUpdateInstructorMutation();
  const deleteMutation = useDeleteInstructorMutation();
  const restoreMutation = useRestoreInstructorMutation();

  const activeMutation = editingInstructor ? updateMutation : registerMutation;

  function handleOpenRegister() {
    setEditingInstructor(null);
    setModalOpen(true);
  }

  function handleOpenEdit(instructor: Instructor) {
    setEditingInstructor(instructor);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingInstructor(null);
    registerMutation.reset();
    updateMutation.reset();
  }

  function handleRegister(data: RegisterInstructorSchema) {
    const normalized = {
      ...data,
      image: data.image ?? undefined,
    };
    registerMutation.mutate(normalized, {
      onSuccess: () => handleCloseModal(),
    });
  }

  function handleUpdate(data: UpdateInstructorSchema) {
    if (!editingInstructor) return;
    confirm({
      intent: "warning",
      title: "Modificar profesor",
      description: `¿Estas seguro que deseas modificar a ${data.name} ${data.lastname}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        const normalized = {
          ...data,
          image: data.image ?? undefined,
        };
        updateMutation.mutate(
          { id: editingInstructor.id, dto: normalized },
          { onSuccess: () => handleCloseModal() },
        );
      },
    });
  }

  function handleDelete(instructor: Instructor) {
    confirm({
      intent: "danger",
      title: "Eliminar profesor",
      description: `¿Estas seguro que deseas eliminar a ${instructor.name} ${instructor.lastname}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ id: instructor.id });
      },
    });
  }

  function handleRestore(instructor: Instructor) {
    confirm({
      intent: "warning",
      title: "Restaurar profesor",
      description: `¿Estas seguro que deseas restaurar a ${instructor.name} ${instructor.lastname}?`,
      confirmLabel: "Restaurar",
      onConfirm: () => {
        restoreMutation.mutate({ id: instructor.id });
      },
    });
  }

  return {
    modalOpen,
    editingInstructor,
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
