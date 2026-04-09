import { Mail, User, CreditCard, Home, Weight, Calendar } from "lucide-react";
import { Button, Input, Label, Select } from "@shared/ui";
import { Form, FormField, FormError, FormImage } from "@shared/components/Form";
import { PhoneInput } from "@shared/components/VariousInputs/PhoneInput";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import {
  registerMemberSchema,
  updateMemberSchema,
  type RegisterMemberSchema,
  type UpdateMemberSchema,
} from "../../../schemas/member.schema";
import type { Member } from "../../../types";
import { TRAINING_GOAL_LABELS } from "../../../constants";

interface MemberFormCreateProps {
  member?: undefined;
  onSubmit: (data: RegisterMemberSchema) => void;
  isPending: boolean;
  mutation: MutationLike;
}

interface MemberFormEditProps {
  member: Member;
  onSubmit: (data: UpdateMemberSchema) => void;
  isPending: boolean;
  mutation: MutationLike;
}

type MemberFormProps = MemberFormCreateProps | MemberFormEditProps;

export function MemberForm({
  member,
  onSubmit,
  isPending,
  mutation,
}: MemberFormProps) {
  const isEditing = !!member;

  if (isEditing) {
    return (
      <Form<UpdateMemberSchema>
        schema={updateMemberSchema}
        onSubmit={(data, form) =>
          onSubmit(
            pickDirtyFields(
              data,
              form.formState.dirtyFields,
            ) as UpdateMemberSchema,
          )
        }
        defaultValues={{
          name: member.name,
          lastname: member.lastname,
          email: member.email ?? "",
          phone: member.phone ?? "",
          emergencyPhone: member.emergencyPhone ?? "",
          address: member.address ?? "",
          bornDate: member.bornDate ?? "",
          currentWeight: member.currentWeight ?? null,
          trainingGoal: member.trainingGoal ?? null,
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField<UpdateMemberSchema> name="name" label="Nombre" required>
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Nombre del alumno"
                leftElement={<User size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<UpdateMemberSchema>
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

          <div>
            <Label htmlFor="member-dni" className="mb-1.5 block">
              DNI
            </Label>
            <Input
              id="member-dni"
              value={member.dni}
              type="text"
              disabled
              leftElement={<CreditCard size={16} aria-hidden="true" />}
            />
            <p className="mt-1 text-xs text-neutral-400">
              El DNI no se puede modificar.
            </p>
          </div>

          <FormField<UpdateMemberSchema> name="email" label="Email">
            {(field) => (
              <Input
                {...field}
                type="email"
                placeholder="Email del alumno"
                leftElement={<Mail size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<UpdateMemberSchema> name="phone" label="Teléfono">
            {(field) => (
              <PhoneInput {...field} placeholder="Teléfono del alumno" />
            )}
          </FormField>

          <FormField<UpdateMemberSchema>
            name="emergencyPhone"
            label="Teléfono de emergencia"
          >
            {(field) => (
              <PhoneInput {...field} placeholder="Teléfono de emergencia" />
            )}
          </FormField>

          <FormField<UpdateMemberSchema> name="address" label="Dirección">
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Dirección del alumno"
                leftElement={<Home size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<UpdateMemberSchema>
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

          <FormField<UpdateMemberSchema>
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
                  const val = e.target.value;
                  field.onChange(val === "" ? null : Number(val));
                }}
                leftElement={<Weight size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<UpdateMemberSchema>
            name="trainingGoal"
            label="Objetivo de entrenamiento"
          >
            {(field) => (
              <Select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
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

          <FormImage<UpdateMemberSchema>
            name="image"
            label="Foto de perfil"
            deleteFieldName="deleteImage"
            deleteFieldTitle="Eliminar foto de perfil"
            deleteFieldDescription="¿Estás seguro que deseas eliminar la foto de perfil?"
          />
        </div>

        <FormError mutation={mutation} />

        <Button
          type="submit"
          intent="primary"
          className="mt-2 w-full"
          isLoading={isPending}
        >
          Guardar cambios
        </Button>
      </Form>
    );
  }

  return (
    <Form<RegisterMemberSchema>
      schema={registerMemberSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterMemberSchema)
      }
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField<RegisterMemberSchema> name="name" label="Nombre" required>
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Nombre del alumno"
              leftElement={<User size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterMemberSchema>
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

        <FormField<RegisterMemberSchema> name="dni" label="DNI" required>
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

        <FormField<RegisterMemberSchema> name="email" label="Email">
          {(field) => (
            <Input
              {...field}
              type="email"
              placeholder="Email del alumno"
              leftElement={<Mail size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterMemberSchema> name="phone" label="Teléfono">
          {(field) => (
            <PhoneInput {...field} placeholder="Teléfono del alumno" />
          )}
        </FormField>

        <FormField<RegisterMemberSchema>
          name="emergencyPhone"
          label="Teléfono de emergencia"
        >
          {(field) => (
            <PhoneInput {...field} placeholder="Teléfono de emergencia" />
          )}
        </FormField>

        <FormField<RegisterMemberSchema> name="address" label="Dirección">
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Dirección del alumno"
              leftElement={<Home size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterMemberSchema>
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

        <FormField<RegisterMemberSchema>
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
                const val = e.target.value;
                field.onChange(val === "" ? null : Number(val));
              }}
              leftElement={<Weight size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterMemberSchema>
          name="trainingGoal"
          label="Objetivo de entrenamiento"
          required
        >
          {(field) => (
            <Select
              {...field}
              value={field.value ?? ""}
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

        <FormImage<RegisterMemberSchema> name="image" label="Foto de perfil" />
      </div>

      <FormError mutation={mutation} />

      <Button
        type="submit"
        intent="primary"
        className="mt-2 w-full"
        isLoading={isPending}
      >
        Registrar alumno
      </Button>
    </Form>
  );
}

MemberForm.displayName = "MemberForm";
