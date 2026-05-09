import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { ExerciseForm } from "../components/ExercisesList/ExerciseForm/ExerciseForm";
import type { ExerciseFormHelpers } from "../components/ExercisesList/ExerciseForm/ExerciseForm";
import { useGroupExercisesQuery } from "../hooks/useGroupExercisesQuery";
import { useRegisterExerciseMutation } from "../hooks/mutations/useRegisterExerciseMutation";
import type { RegisterExerciseSchema } from "../schemas/exercise.schema";
import type { RegisterExercise } from "../types";

interface RegisterExercisePageProps {
  groupId: string;
}

export default function RegisterExercisePage({
  groupId,
}: RegisterExercisePageProps) {
  const navigate = useNavigate();
  const mutation = useRegisterExerciseMutation();
  const [navigating, setNavigating] = useState(false);
  const [createMore, setCreateMore] = useState(false);

  const { data: groupsData, isLoading: isLoadingGroups } =
    useGroupExercisesQuery({ page: 1, size: 100 });
  const groups = groupsData?.data ?? [];

  function goToList(targetGroupId: string) {
    flushSync(() => setNavigating(true));
    navigate({
      to: "/exercises/$groupId",
      params: { groupId: targetGroupId },
    });
  }

  function handleBack() {
    navigate({
      to: "/exercises/$groupId",
      params: { groupId },
    });
  }

  function handleRegister(
    data: RegisterExerciseSchema,
    helpers: ExerciseFormHelpers,
  ) {
    confirm({
      intent: "info",
      title: "Registrar ejercicio",
      description: "¿Estás seguro que deseas registrar el ejercicio?",
      confirmLabel: "Registrar",
      onConfirm: () => {
        const { exerciseGroupId, ...rest } = data;
        const dto: RegisterExercise = rest;
        mutation.mutate(
          { groupId: exerciseGroupId, dto },
          {
            onSuccess: () => {
              if (createMore) {
                helpers.resetPreservingGroup();
              } else {
                goToList(exerciseGroupId);
              }
            },
          },
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Registrar ejercicio"
        description="Completá la información para registrar un nuevo ejercicio."
        actions={
          <Button intent="neutral" variant="outline" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

      <ExerciseForm
        initialGroupId={groupId}
        groups={groups}
        isLoadingGroups={isLoadingGroups}
        onSubmit={handleRegister}
        onCancel={handleBack}
        isPending={mutation.isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
        createMore={createMore}
        onCreateMoreChange={setCreateMore}
      />
    </div>
  );
}
