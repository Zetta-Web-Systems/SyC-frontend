import { Calendar, Weight } from "lucide-react";
import { Card, Input, Select } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { TRAINING_GOAL_LABELS } from "../../../../constants";
import type { RegisterMemberSchema } from "../../../../schemas/member.schema";

type MemberFormValues = RegisterMemberSchema & { deleteImage?: boolean };

export function PhysicalCard() {
  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-4">
        <h6 className="flex items-center gap-1.5 text-neutral-500">
          Perfil físico
        </h6>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FormField<MemberFormValues>
            name="bornDate"
            label="Fecha de nacimiento"
          >
            {(field) => (
              <Input
                {...field}
                type="date"
                leftElement={<Calendar size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<MemberFormValues>
            name="currentWeight"
            label="Peso actual (kg)"
          >
            {(field) => (
              <Input
                {...field}
                type="number"
                placeholder="Peso en kg"
                value={field.value ?? ""}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const val = target.value;
                  field.onChange(val === "" ? null : Number(val));
                }}
                leftElement={<Weight size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<MemberFormValues>
            name="trainingGoal"
            label="Objetivo de entrenamiento"
          >
            {(field) => (
              <Select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const target = e.target as HTMLSelectElement;
                  const val = target.value;
                  field.onChange(val === "" ? null : val);
                }}
                placeholder="Seleccionar objetivo"
                error={field.error}
              >
                {Object.entries(TRAINING_GOAL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>
      </div>
    </Card>
  );
}

PhysicalCard.displayName = "PhysicalCard";
