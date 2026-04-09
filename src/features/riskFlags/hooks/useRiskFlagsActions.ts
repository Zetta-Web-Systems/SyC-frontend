import { useState } from "react";
import { confirm } from "@shared/stores/confirm.store";
import { useRegisterRiskFlagMutation } from "./mutations/useRegisterRiskFlagMutation";
import { useUpdateRiskFlagMutation } from "./mutations/useUpdateRiskFlagMutation";
import { useDeleteRiskFlagMutation } from "./mutations/useDeleteRiskFlagMutation";
import { useRestoreRiskFlagMutation } from "./mutations/useRestoreRiskFlagMutation";
import type {
  RegisterRiskFlagSchema,
  UpdateRiskFlagSchema,
} from "../schemas/riskFlag.schema";
import type { RiskFlag } from "../types";

export function useRiskFlagsActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRiskFlag, setEditingRiskFlag] = useState<RiskFlag | null>(null);

  const registerMutation = useRegisterRiskFlagMutation();
  const updateMutation = useUpdateRiskFlagMutation();
  const deleteMutation = useDeleteRiskFlagMutation();
  const restoreMutation = useRestoreRiskFlagMutation();

  const activeMutation = editingRiskFlag ? updateMutation : registerMutation;

  function handleOpenRegister() {
    setEditingRiskFlag(null);
    setModalOpen(true);
  }

  function handleOpenEdit(riskFlag: RiskFlag) {
    setEditingRiskFlag(riskFlag);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingRiskFlag(null);
    registerMutation.reset();
    updateMutation.reset();
  }

  function handleRegister(data: RegisterRiskFlagSchema) {
    confirm({
      intent: "info",
      title: "Registrar riesgo",
      description: `¿Estas seguro que deseas registrar el riesgo?`,
      confirmLabel: "Registrar",
      onConfirm: () => {
        registerMutation.mutate(data, {
          onSuccess: () => handleCloseModal(),
        });
      },
    });
  }

  function handleUpdate(data: UpdateRiskFlagSchema) {
    if (!editingRiskFlag) return;
    if (Object.keys(data).length === 0) {
      handleCloseModal();
      return;
    }
    confirm({
      intent: "warning",
      title: "Modificar riesgo",
      description: `¿Estas seguro que deseas el riesgo ${editingRiskFlag.name}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        updateMutation.mutate(
          { id: editingRiskFlag.id, dto: data },
          { onSuccess: () => handleCloseModal() },
        );
      },
    });
  }

  function handleDelete(riskFlag: RiskFlag) {
    confirm({
      intent: "danger",
      title: "Eliminar riesgo",
      description: `¿Estas seguro que deseas eliminar el riesgo ${riskFlag.name}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ id: riskFlag.id });
      },
    });
  }

  function handleRestore(riskFlag: RiskFlag) {
    confirm({
      intent: "warning",
      title: "Restaurar riesgo",
      description: `¿Estas seguro que deseas restaurar el riesgo ${riskFlag.name}?`,
      confirmLabel: "Restaurar",
      onConfirm: () => {
        restoreMutation.mutate({ id: riskFlag.id });
      },
    });
  }

  return {
    modalOpen,
    editingRiskFlag,
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
