import type { Ref } from "react";
import type { Path } from "react-hook-form";
import { Input } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { MOVEMENT_PHASE_MAX_LENGTH } from "../../../../constants";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";

interface MovementPhaseFieldProps {
  name: Path<ClinicalProfileFormSchema>;
  label?: string;
}

export function MovementPhaseField({
  name,
  label = "Fase del movimiento",
}: MovementPhaseFieldProps) {
  return (
    <FormField<ClinicalProfileFormSchema> name={name} label={label}>
      {(field) => (
        <Input
          ref={field.ref as unknown as Ref<HTMLInputElement>}
          id={field.id}
          name={field.name}
          type="text"
          value={(field.value as string | undefined) ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            field.onChange(v === "" ? undefined : v);
          }}
          onBlur={field.onBlur}
          disabled={field.disabled}
          error={field.error}
          maxLength={MOVEMENT_PHASE_MAX_LENGTH}
          placeholder="Nombre de fase de movimiento"
        />
      )}
    </FormField>
  );
}

MovementPhaseField.displayName = "MovementPhaseField";
