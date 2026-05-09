import { Card, Label, Textarea } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import type {
  RegisterExerciseSchema,
  UpdateExerciseSchema,
} from "../../../../../schemas/exercise.schema";
import { LinksTabs } from "./LinksTabs";

type ExerciseFormValues = RegisterExerciseSchema | UpdateExerciseSchema;

export function DetailsCard() {
  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-5">
        <h6 className="flex items-center gap-1.5 text-neutral-500">
          Detalles del ejercicio
        </h6>

        <FormField<ExerciseFormValues>
          name={"technicalDescription" as never}
          label="Descripción técnica"
        >
          {(field) => (
            <Textarea
              {...field}
              rows={4}
              placeholder="Descripción de cómo se realiza el ejercicio"
            />
          )}
        </FormField>

        <div className="flex flex-col gap-1.5">
          <Label>Links</Label>
          <LinksTabs />
        </div>

        <FormField<ExerciseFormValues> name={"notes" as never} label="Notas">
          {(field) => (
            <Textarea {...field} rows={3} placeholder="Notas adicionales" />
          )}
        </FormField>
      </div>
    </Card>
  );
}
