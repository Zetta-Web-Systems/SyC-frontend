import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { ExerciseForm } from "../components/ExercisesList/ExerciseForm/ExerciseForm";
import { useExerciseQuery } from "../hooks/useExerciseQuery";
import { useGroupExercisesQuery } from "../hooks/useGroupExercisesQuery";
import { useUpdateExerciseMutation } from "../hooks/mutations/useUpdateExerciseMutation";
import type { UpdateExerciseSchema } from "../schemas/exercise.schema";
import type { UpdateExercise } from "../types";

interface UpdateExercisePageProps {
  groupId: string;
  exerciseId: string;
}

export default function UpdateExercisePage({
  groupId,
  exerciseId,
}: UpdateExercisePageProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const mutation = useUpdateExerciseMutation();
  const { data: exercise, isLoading, isError } = useExerciseQuery(exerciseId);
  const { data: groupsData, isLoading: isLoadingGroups } =
    useGroupExercisesQuery({ page: 1, size: 100 });
  const groups = groupsData?.data ?? [];

  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({
      to: "/exercises/$groupId",
      params: { groupId },
    });
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      navigate({
        to: "/exercises/$groupId",
        params: { groupId },
      });
    }
  }

  function handleUpdate(data: UpdateExerciseSchema) {
    if (!exercise) return;
    if (Object.keys(data).length === 0) {
      goToList();
      return;
    }
    confirm({
      intent: "warning",
      title: "Modificar ejercicio",
      description: `¿Estás seguro que deseas modificar el ejercicio "${exercise.name}"?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        const { exerciseGroupId: _ignored, image, ...rest } = data;
        const dto: UpdateExercise = { ...rest, image: image ?? undefined };
        mutation.mutate(
          { id: exercise.id, dto },
          { onSuccess: () => goToList() },
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Editar ejercicio"
        description="Modificá la información del ejercicio"
        actions={
          <Button intent="neutral" variant="outline" onClick={handleBack}>
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
          No se pudo cargar el ejercicio.
        </p>
      )}

      {exercise && (
        <ExerciseForm
          exercise={exercise}
          initialGroupId={groupId}
          groups={groups}
          isLoadingGroups={isLoadingGroups}
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
