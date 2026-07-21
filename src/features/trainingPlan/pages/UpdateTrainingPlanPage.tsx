import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { ListState } from "@shared/components/ListState";
import { useTrainingPlanQuery } from "../hooks/queries/useTrainingPlanQuery";
import { TrainingPlanEditor } from "../components/TrainingPlanEditor/TrainingPlanEditor";

interface UpdateTrainingPlanPageProps {
  trainingPlanId: string;
}

export default function UpdateTrainingPlanPage({
  trainingPlanId,
}: UpdateTrainingPlanPageProps) {
  const navigate = useNavigate();
  const {
    data: plan,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useTrainingPlanQuery(trainingPlanId);

  function goToList() {
    void navigate({ to: "/training-plans" });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Editar planificación"
        description="Modificá los bloques, días y ejercicios de la planificación"
        actions={
          <Button intent="neutral" variant="outline" onClick={goToList}>
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
        <ListState
          kind="error"
          variant="block"
          message="No se pudo cargar la planificación"
          description="Intentá nuevamente en unos instantes"
        />
      )}

      {!isLoading && !isError && plan && (
        <TrainingPlanEditor key={dataUpdatedAt} plan={plan} onDone={goToList} />
      )}
    </div>
  );
}
