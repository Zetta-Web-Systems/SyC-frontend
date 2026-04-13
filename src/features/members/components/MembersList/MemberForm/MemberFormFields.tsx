import { Mail, User, CreditCard, Home, Weight, Calendar } from "lucide-react";
import { Input, Label, Select } from "@shared/ui";
import { FormField, FormImage } from "@shared/components/Form";
import { PhoneInput } from "@shared/components/VariousInputs/PhoneInput";
import type { RegisterMemberSchema } from "../../../schemas/member.schema";
import { TRAINING_GOAL_LABELS } from "../../../constants";

type MemberFormValues = RegisterMemberSchema & { deleteImage?: boolean };

interface MemberFormFieldsProps {
  mode: "create" | "edit";
  dni?: string;
}

export function MemberFormFields({ mode, dni }: MemberFormFieldsProps) {
  const isEditing = mode === "edit";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <FormField<MemberFormValues> name="lastname" label="Apellido" required>
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
        <div>
          <Label htmlFor="member-dni" className="mb-1.5 block">
            DNI
          </Label>
          <Input
            id="member-dni"
            value={dni ?? ""}
            type="text"
            disabled
            leftElement={<CreditCard size={16} aria-hidden="true" />}
          />
          <p className="mt-1 text-xs text-neutral-400">
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
        required={!isEditing}
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

      {isEditing ? (
        <FormImage<MemberFormValues>
          name="image"
          label="Foto de perfil"
          deleteFieldName="deleteImage"
          deleteFieldTitle="Eliminar foto de perfil"
          deleteFieldDescription="¿Estás seguro que deseas eliminar la foto de perfil?"
        />
      ) : (
        <FormImage<MemberFormValues> name="image" label="Foto de perfil" />
      )}
    </div>
  );
}

MemberFormFields.displayName = "MemberFormFields";
