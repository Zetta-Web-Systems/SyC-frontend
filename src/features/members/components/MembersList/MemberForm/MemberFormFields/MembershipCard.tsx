import { CreditCard } from "lucide-react";
import { Card, Select } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { MEMBER_PLAN_TYPE_FILTER_OPTIONS } from "@features/memberPlans";
import type { RegisterMemberSchema } from "../../../../schemas/member.schema";

export function MembershipCard() {
  return (
    <Card surface="panel" padding="lg">
      <div className="flex flex-col gap-4">
        <h6 className="flex items-center gap-1.5 text-neutral-500">
          <CreditCard size={16} aria-hidden="true" />
          Membresía (opcional)
        </h6>

        <FormField<RegisterMemberSchema>
          name="memberPlanType"
          label="Tipo de membresía"
        >
          {(field) => (
            <Select
              id={field.id}
              name={field.name}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = (e.target as HTMLSelectElement).value;
                field.onChange(value === "" ? null : value);
              }}
              onBlur={field.onBlur}
              placeholder="Sin membresía"
              error={field.error}
              aria-describedby={field["aria-describedby"]}
            >
              {MEMBER_PLAN_TYPE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <p className="text-xs text-neutral-400">
          Si elegís un plan, se le registra la membresía y su primera cuota al
          dar de alta. Si no, podés asignarla después desde el perfil.
        </p>
      </div>
    </Card>
  );
}

MembershipCard.displayName = "MembershipCard";
