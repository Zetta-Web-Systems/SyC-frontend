import { Dumbbell } from "lucide-react";
import { Card, Input } from "@shared/ui";
import { FormField, FormImage } from "@shared/components/Form";
import type {
  RegisterExerciseSchema,
  UpdateExerciseSchema,
} from "../../../../../schemas/exercise.schema";
import type { Exercise, ExerciseGroup } from "../../../../../types";
import { GroupExerciseSelectField } from "../../../GroupExerciseSelectField/GroupExerciseSelectField";
import { ExerciseLevelField } from "./ExerciseLevelField";

type ExerciseFormValues = RegisterExerciseSchema | UpdateExerciseSchema;

interface BasicInfoCardProps {
  groups: ExerciseGroup[];
  exercise?: Exercise;
  isLoadingGroups?: boolean;
  onGroupSearch?: (q: string) => void;
  onGroupCreated?: (group: ExerciseGroup) => void;
}

export function BasicInfoCard({
  groups,
  exercise,
  isLoadingGroups,
  onGroupSearch,
  onGroupCreated,
}: BasicInfoCardProps) {
  return (
    <Card surface="panel" padding="lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2">
          {exercise ? (
            <FormImage<UpdateExerciseSchema>
              name={"image" as never}
              shape="square"
              initialPreview={exercise.image ?? null}
              deleteFieldName="deleteImage"
              deleteFieldTitle="Eliminar imagen del ejercicio"
              deleteFieldDescription="¿Estás seguro que deseas eliminar la imagen del ejercicio?"
            />
          ) : (
            <FormImage<RegisterExerciseSchema>
              name={"image" as never}
              shape="square"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h6 className="flex items-center gap-1.5 text-neutral-500">
            Datos básicos
          </h6>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_2fr_1fr]">
            <FormField<ExerciseFormValues>
              name={"name" as never}
              label="Nombre"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Nombre del ejercicio"
                  leftElement={<Dumbbell size={16} aria-hidden="true" />}
                />
              )}
            </FormField>

            <FormField<ExerciseFormValues>
              name={"exerciseGroupId" as never}
              label="Grupo de ejercicios"
              required
            >
              {(field) => (
                <GroupExerciseSelectField
                  value={
                    groups.find(
                      (g) => g.id === (field.value as string | undefined),
                    ) ?? null
                  }
                  onChange={(group) => field.onChange(group?.id ?? "")}
                  groups={groups}
                  isLoading={isLoadingGroups}
                  onSearch={onGroupSearch}
                  onCreated={(group) => {
                    field.onChange(group.id);
                    onGroupCreated?.(group);
                  }}
                  error={field.error}
                  disabled={field.disabled}
                  id={field.id}
                  aria-describedby={field["aria-describedby"]}
                />
              )}
            </FormField>

            <ExerciseLevelField />
          </div>
        </div>
      </div>
    </Card>
  );
}
