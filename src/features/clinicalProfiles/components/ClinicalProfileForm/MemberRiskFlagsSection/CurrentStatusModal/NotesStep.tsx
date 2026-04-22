import type { Ref } from "react";
import { Textarea } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { NOTES_MAX_LENGTH } from "../../../../constants";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";

interface NotesStepProps {
  riskFlagIndex: number;
}

export function NotesStep({ riskFlagIndex }: NotesStepProps) {
  const notesName = memberRiskFlagPaths.notes(riskFlagIndex);

  return (
    <div className="flex flex-col gap-4">
      <FormField<ClinicalProfileFormSchema>
        name={notesName}
        label="Notas clínicas"
      >
        {(field) => (
          <Textarea
            ref={field.ref as unknown as Ref<HTMLTextAreaElement>}
            id={field.id}
            name={field.name}
            value={(field.value as string | undefined) ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            disabled={field.disabled}
            error={field.error}
            aria-describedby={field["aria-describedby"]}
            rows={6}
            maxLength={NOTES_MAX_LENGTH}
            placeholder="Notas clínicas para esta bandera de riesgo"
          />
        )}
      </FormField>
    </div>
  );
}

NotesStep.displayName = "NotesStep";
