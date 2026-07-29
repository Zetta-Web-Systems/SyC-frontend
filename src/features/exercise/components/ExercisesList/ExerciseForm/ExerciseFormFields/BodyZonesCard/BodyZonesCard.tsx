import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RotateCcw } from "lucide-react";
import { Button, Card } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { BodyZoneSelector } from "@shared/components/BodyZoneSelector";
import type { BodyZone } from "@shared/types/bodyZone.types";
import type {
  RegisterExerciseSchema,
  UpdateExerciseSchema,
} from "../../../../../schemas/exercise.schema";
import type { Exercise, ExerciseGroup } from "../../../../../types";
import { InheritanceCaption } from "./InheritanceCaption";

type ExerciseFormValues = RegisterExerciseSchema | UpdateExerciseSchema;

interface BodyZonesCardProps {
  groups: ExerciseGroup[];
  exercise?: Exercise;
}

export function BodyZonesCard({ groups, exercise }: BodyZonesCardProps) {
  const form = useFormContext<ExerciseFormValues>();
  const watchedGroupId = form.watch("exerciseGroupId" as never) as unknown as
    | string
    | undefined;

  const selectedGroup = groups.find((g) => g.id === watchedGroupId);
  const groupZones = selectedGroup?.affectedZones ?? [];
  const isEditing = !!exercise;

  useEffect(() => {
    if (!selectedGroup) return;
    const dirty = form.formState.dirtyFields as Record<string, unknown>;
    if (isEditing && !dirty.exerciseGroupId) return;
    if (dirty.affectedZones) return;
    form.setValue(
      "affectedZones" as never,
      (selectedGroup.affectedZones ?? []) as never,
      { shouldDirty: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup?.id]);

  const currentZones =
    (form.watch("affectedZones" as never) as unknown as
      | BodyZone[]
      | undefined) ?? [];
  const inheritsFromGroup =
    groupZones.length > 0 &&
    currentZones.length === groupZones.length &&
    currentZones.every((z) => groupZones.includes(z));

  const hasGroupWithZones = !!selectedGroup && groupZones.length > 0;

  function handleRestoreFromGroup() {
    if (!selectedGroup) return;
    form.setValue(
      "affectedZones" as never,
      (selectedGroup.affectedZones ?? []) as never,
      { shouldDirty: true },
    );
    form.clearErrors("affectedZones" as never);
  }

  return (
    <Card surface="panel" padding="lg">
      <div className="flex flex-col gap-4">
        <h6 className="flex items-center gap-1.5 text-neutral-500">
          Zonas afectadas
        </h6>

        <FormField<ExerciseFormValues> name={"affectedZones" as never}>
          {(field) => (
            <BodyZoneSelector
              id={field.id}
              value={(field.value as BodyZone[] | undefined) ?? []}
              onChange={field.onChange}
              error={field.error}
              aria-describedby={field["aria-describedby"]}
              disabled={field.disabled}
              bodyFooter={
                hasGroupWithZones ? (
                  <InheritanceCaption inheritsFromGroup={inheritsFromGroup} />
                ) : null
              }
              footerExtra={
                hasGroupWithZones && !inheritsFromGroup ? (
                  <Button
                    variant="ghost"
                    intent="neutral"
                    size="sm"
                    onClick={handleRestoreFromGroup}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    Restaurar
                  </Button>
                ) : null
              }
            />
          )}
        </FormField>
      </div>
    </Card>
  );
}
