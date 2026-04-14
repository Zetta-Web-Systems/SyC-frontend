import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { RiskFlagForm } from "../components/RiskFlagsList/RiskFlagForm/RiskFlagForm";
import { useRiskFlagQuery } from "../hooks/useRiskFlagQuery";
import { useUpdateRiskFlagMutation } from "../hooks/mutations/useUpdateRiskFlagMutation";
import type { UpdateRiskFlagSchema } from "../schemas/riskFlag.schema";

interface UpdateRiskFlagPageProps {
  riskFlagId: string;
}

export default function UpdateRiskFlagPage({
  riskFlagId,
}: UpdateRiskFlagPageProps) {
  const navigate = useNavigate();
  const mutation = useUpdateRiskFlagMutation();
  const { data: riskFlag, isLoading, isError } = useRiskFlagQuery(riskFlagId);
  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({ to: "/settings/risk-flags" });
  }

  function handleBack() {
    navigate({ to: "/settings/risk-flags" });
  }

  function handleUpdate(data: UpdateRiskFlagSchema) {
    if (!riskFlag) return;
    if (Object.keys(data).length === 0) {
      goToList();
      return;
    }
    confirm({
      intent: "warning",
      title: "Modificar bandera de riesgo",
      description: `¿Estás seguro que deseas modificar la bandera de riesgo ${riskFlag.name}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        mutation.mutate(
          { id: riskFlag.id, dto: data },
          { onSuccess: () => goToList() },
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Editar bandera de riesgo"
        description="Modifica la información de la bandera de riesgo."
        actions={
          <Button
            type="button"
            intent="neutral"
            variant="outline"
            onClick={handleBack}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <p
          role="alert"
          className="rounded-xl border border-error bg-error/5 p-4 text-sm text-error"
        >
          No se pudo cargar la bandera de riesgo.
        </p>
      )}

      {riskFlag && (
        <RiskFlagForm
          riskFlag={riskFlag}
          onSubmit={handleUpdate}
          onCancel={handleBack}
          isPending={mutation.isPending}
          mutation={mutation}
          guardUnsavedChanges={!navigating}
        />
      )}
    </div>
  );
}
