import { Textarea } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { GENERAL_OBSERVATIONS_MAX_LENGTH } from "../../../constants";
import type { ClinicalProfileFormSchema } from "../../../schemas/clinicalProfile.schema";

export function GeneralObservationsField() {
  return (
    <FormField<ClinicalProfileFormSchema>
      name="generalObservations"
      label="Observaciones generales"
    >
      {(field) => (
        <Textarea
          ref={field.ref}
          id={field.id}
          name={field.name}
          value={(field.value as string | undefined) ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          disabled={field.disabled}
          error={field.error}
          aria-describedby={field["aria-describedby"]}
          rows={4}
          maxLength={GENERAL_OBSERVATIONS_MAX_LENGTH}
          placeholder="Observaciones generales sobre el perfil clínico del alumno"
        />
      )}
    </FormField>
  );
}

GeneralObservationsField.displayName = "GeneralObservationsField";
