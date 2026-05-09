import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { GroupExerciseForm } from "../components/GroupExercisesList/GroupExerciseForm/GroupExerciseForm";
import { useGroupExerciseQuery } from "../hooks/useGroupExerciseQuery";
import { useUpdateGroupExerciseMutation } from "../hooks/mutations/useUpdateGroupExerciseMutation";
import type { UpdateGroupExerciseSchema } from "../schemas/groupExercise.schema";

interface UpdateGroupExercisePageProps {
  groupExerciseId: string;
}

export default function UpdateGroupExercisePage({
  groupExerciseId,
}: UpdateGroupExercisePageProps) {
  const navigate = useNavigate();
  const mutation = useUpdateGroupExerciseMutation();
  const {
    data: group,
    isLoading,
    isError,
  } = useGroupExerciseQuery(groupExerciseId);
  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({ to: "/settings/group-exercises" });
  }

  function handleBack() {
    navigate({ to: "/settings/group-exercises" });
  }

  function handleUpdate(data: UpdateGroupExerciseSchema) {
    if (!group) return;
    if (Object.keys(data).length === 0) {
      goToList();
      return;
    }
    confirm({
      intent: "warning",
      title: "Modificar grupo de ejercicios",
      description: `¿Estás seguro que deseas modificar el grupo de ejercicios ${group.name}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        mutation.mutate(
          { id: group.id, dto: data },
          { onSuccess: () => goToList() },
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Editar grupo de ejercicios"
        description="Modifica la información del grupo de ejercicios."
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
          No se pudo cargar el grupo de ejercicios.
        </p>
      )}

      {group && (
        <GroupExerciseForm
          group={group}
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
