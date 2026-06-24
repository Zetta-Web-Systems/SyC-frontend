import { CreditCard, User } from "lucide-react";
import { Card, Input, Label } from "@shared/ui";
import { FormField, FormImage } from "@shared/components/Form";
import type { RegisterMemberSchema } from "../../../../schemas/member.schema";

type MemberFormValues = RegisterMemberSchema & { deleteImage?: boolean };

interface IdentityCardProps {
  mode: "create" | "edit";
  dni?: string;
  initialImagePreview?: string | null;
}

export function IdentityCard({
  mode,
  dni,
  initialImagePreview,
}: IdentityCardProps) {
  const isEditing = mode === "edit";

  return (
    <Card surface="panel" padding="lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2">
          {isEditing ? (
            <FormImage<MemberFormValues>
              name="image"
              deleteFieldName="deleteImage"
              deleteFieldTitle="Eliminar foto de perfil"
              deleteFieldDescription="¿Estás seguro que deseas eliminar la foto de perfil?"
              initialPreview={initialImagePreview}
            />
          ) : (
            <FormImage<MemberFormValues> name="image" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h6 className="flex items-center gap-1.5 text-neutral-500">
              Identidad
            </h6>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FormField<MemberFormValues> name="name" label="Nombre" required>
              {(field) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Nombre del alumno"
                  leftElement={<User size={16} aria-hidden="true" />}
                />
              )}
            </FormField>

            <FormField<MemberFormValues>
              name="lastname"
              label="Apellido"
              required
            >
              {(field) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Apellido del alumno"
                  leftElement={<User size={16} aria-hidden="true" />}
                />
              )}
            </FormField>

            {isEditing ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="member-dni">DNI</Label>
                <div className="relative flex h-10 items-center rounded-xl border border-neutral-200 bg-neutral-50 pr-2 pl-9">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                  >
                    <CreditCard size={16} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-neutral-600">
                    {dni ?? ""}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  El DNI no se puede modificar.
                </p>
              </div>
            ) : (
              <FormField<MemberFormValues> name="dni" label="DNI" required>
                {(field) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Documento del alumno"
                    inputMode="numeric"
                    maxLength={8}
                    leftElement={<CreditCard size={16} aria-hidden="true" />}
                  />
                )}
              </FormField>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

IdentityCard.displayName = "IdentityCard";
