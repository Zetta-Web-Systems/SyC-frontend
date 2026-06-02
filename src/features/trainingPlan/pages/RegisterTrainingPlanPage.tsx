import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { TrainingPlanForm } from "../components/TrainingPlanForm/TrainingPlanForm";
import { useRegisterTrainingPlanSubmit } from "../hooks/useRegisterTrainingPlanSubmit";

export default function RegisterTrainingPlanPage() {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    void navigate({ to: "/training-plans" });
  }

  function handleBack() {
    void navigate({ to: "/training-plans" });
  }

  const { isPending, mutation, handleSubmit } = useRegisterTrainingPlanSubmit({
    onSuccess: goToList,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Registrar planificación"
        description="Diseñá los bloques, días y ejercicios de la planificación"
        actions={
          <div className="flex gap-2">
            <Button intent="neutral" variant="outline" disabled>
              <FileText size={16} aria-hidden="true" />
              <span className="hidden xs:inline">Cargar plantilla</span>
            </Button>
            <Button intent="neutral" variant="outline" onClick={handleBack}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="hidden xs:inline">Volver</span>
            </Button>
          </div>
        }
      />

      <TrainingPlanForm
        onSubmit={handleSubmit}
        onCancel={handleBack}
        isPending={isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
      />
    </div>
  );
}
