import { Home, Mail } from "lucide-react";
import { Card, Input } from "@shared/ui";
import { FormField } from "@shared/components/Form";
import { PhoneInput } from "@shared/components/VariousInputs/PhoneInput";
import type { RegisterMemberSchema } from "../../../../schemas/member.schema";

type MemberFormValues = RegisterMemberSchema & { deleteImage?: boolean };

export function ContactCard() {
  return (
    <Card surface="panel" padding="lg">
      <div className="flex flex-col gap-4">
        <h6 className="flex items-center gap-1.5 text-neutral-500">Contacto</h6>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField<MemberFormValues> name="email" label="Email">
            {(field) => (
              <Input
                {...field}
                type="email"
                placeholder="Email del alumno"
                leftElement={<Mail size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<MemberFormValues> name="phone" label="Teléfono">
            {(field) => (
              <PhoneInput {...field} placeholder="Teléfono del alumno" />
            )}
          </FormField>

          <FormField<MemberFormValues>
            name="emergencyPhone"
            label="Teléfono de emergencia"
          >
            {(field) => (
              <PhoneInput {...field} placeholder="Teléfono de emergencia" />
            )}
          </FormField>

          <FormField<MemberFormValues> name="address" label="Dirección">
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Dirección del alumno"
                leftElement={<Home size={16} aria-hidden="true" />}
              />
            )}
          </FormField>
        </div>
      </div>
    </Card>
  );
}

ContactCard.displayName = "ContactCard";
