import { useNavigate } from "@tanstack/react-router";
import { confirm } from "@shared/stores/confirm.store";
import { useDeleteRiskFlagMutation } from "./mutations/useDeleteRiskFlagMutation";
import { useRestoreRiskFlagMutation } from "./mutations/useRestoreRiskFlagMutation";
import type { RiskFlag } from "../types";

export function useRiskFlagsActions() {
  const navigate = useNavigate();

  const deleteMutation = useDeleteRiskFlagMutation();
  const restoreMutation = useRestoreRiskFlagMutation();

  const handleOpenRegister = () =>
    navigate({ to: "/settings/risk-flags/register" });

  const handleOpenEdit = (riskFlag: RiskFlag) =>
    navigate({
      to: "/settings/risk-flags/update/$riskFlagId",
      params: { riskFlagId: riskFlag.id },
    });

  function handleDelete(riskFlag: RiskFlag) {
    confirm({
      intent: "danger",
      title: "Eliminar bandera de riesgo",
      description: `¿Estás seguro que deseas eliminar la bandera de riesgo ${riskFlag.name}?`,
      confirmLabel: "Eliminar",
      onConfirm: () => {
        deleteMutation.mutate({ id: riskFlag.id });
      },
    });
  }

  function handleRestore(riskFlag: RiskFlag) {
    confirm({
      intent: "warning",
      title: "Restaurar bandera de riesgo",
      description: `¿Estás seguro que deseas restaurar la bandera de riesgo ${riskFlag.name}?`,
      confirmLabel: "Restaurar",
      onConfirm: () => {
        restoreMutation.mutate({ id: riskFlag.id });
      },
    });
  }

  return {
    handleOpenRegister,
    handleOpenEdit,
    handleDelete,
    handleRestore,
  };
}
