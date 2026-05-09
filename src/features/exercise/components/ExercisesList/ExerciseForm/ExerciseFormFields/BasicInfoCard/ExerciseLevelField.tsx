import { useFormContext } from "react-hook-form";
import { Label, Select } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import {
  EXERCISE_LEVEL_OPTIONS,
  type ExerciseLevel,
} from "../../../../../constants";
import type {
  RegisterExerciseSchema,
  UpdateExerciseSchema,
} from "../../../../../schemas/exercise.schema";
import { ExerciseLevelIndicator } from "./ExerciseLevelIndicator";

type ExerciseFormValues = RegisterExerciseSchema | UpdateExerciseSchema;

export function ExerciseLevelField() {
  const form = useFormContext<ExerciseFormValues>();
  const watchedLevel = form.watch("exerciseLevel" as never) as unknown as
    | ExerciseLevel
    | undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="field-exerciseLevel" required>
          Nivel
        </Label>
        <ExerciseLevelIndicator level={watchedLevel} />
      </div>

      <FormField<ExerciseFormValues> name={"exerciseLevel" as never}>
        {(field) => (
          <Select
            id={field.id}
            value={(field.value as string | undefined) ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            disabled={field.disabled}
            error={field.error}
            placeholder="Seleccionar"
            aria-describedby={field["aria-describedby"]}
          >
            {EXERCISE_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        )}
      </FormField>
    </div>
  );
}
