import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { RiskFlagForm } from "../components/RiskFlagsList/RiskFlagForm/RiskFlagForm";
import { useRegisterRiskFlagMutation } from "../hooks/mutations/useRegisterRiskFlagMutation";
import type { RegisterRiskFlagSchema } from "../schemas/riskFlag.schema";

export default function RegisterRiskFlagPage() {
  const navigate = useNavigate();
  const mutation = useRegisterRiskFlagMutation();
  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({ to: "/settings/risk-flags" });
  }

  function handleBack() {
    navigate({ to: "/settings/risk-flags" });
  }

  function handleRegister(data: RegisterRiskFlagSchema) {
    confirm({
      intent: "info",
      title: "Registrar bandera de riesgo",
      description: "¿Estás seguro que deseas registrar la bandera de riesgo?",
      confirmLabel: "Registrar",
      onConfirm: () => {
        mutation.mutate(data, {
          onSuccess: () => goToList(),
        });
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Registrar bandera de riesgo"
        description="Completa la información para registrar una nueva bandera de riesgo"
        actions={
          <Button variant="outline" intent="neutral" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

      <RiskFlagForm
        onSubmit={handleRegister}
        onCancel={handleBack}
        isPending={mutation.isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
      />
    </div>
  );
}
