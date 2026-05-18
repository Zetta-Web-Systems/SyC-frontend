import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { GroupExerciseForm } from "../components/GroupExercisesList/GroupExerciseForm/GroupExerciseForm";
import { useRegisterGroupExerciseMutation } from "../hooks/mutations/useRegisterGroupExerciseMutation";
import type { RegisterGroupExerciseSchema } from "../schemas/groupExercise.schema";

export default function RegisterGroupExercisePage() {
  const navigate = useNavigate();
  const mutation = useRegisterGroupExerciseMutation();
  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({ to: "/settings/group-exercises" });
  }

  function handleBack() {
    navigate({ to: "/settings/group-exercises" });
  }

  function handleRegister(data: RegisterGroupExerciseSchema) {
    confirm({
      intent: "info",
      title: "Registrar grupo de ejercicios",
      description: "¿Estás seguro que deseas registrar el grupo de ejercicios?",
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
        title="Registrar grupo de ejercicios"
        description="Completa la información para registrar un nuevo grupo de ejercicios"
        actions={
          <Button variant="outline" intent="neutral" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

      <GroupExerciseForm
        onSubmit={handleRegister}
        onCancel={handleBack}
        isPending={mutation.isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
      />
    </div>
  );
}
