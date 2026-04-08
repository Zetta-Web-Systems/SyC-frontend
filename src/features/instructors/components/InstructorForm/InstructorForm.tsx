import { Mail, User, CreditCard, Home } from "lucide-react";
import { Button, Input, Label } from "@shared/ui";
import { Form, FormField, FormError, FormImage } from "@shared/components/Form";
import { PhoneInput } from "@shared/components/VariousInputs/PhoneInput";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import {
  registerInstructorSchema,
  updateInstructorSchema,
  type RegisterInstructorSchema,
  type UpdateInstructorSchema,
} from "../../schemas/instructor.schema";
import type { Instructor } from "../../types";

interface InstructorFormCreateProps {
  instructor?: undefined;
  onSubmit: (data: RegisterInstructorSchema) => void;
  isPending: boolean;
  mutation: MutationLike;
}

interface InstructorFormEditProps {
  instructor: Instructor;
  onSubmit: (data: UpdateInstructorSchema) => void;
  isPending: boolean;
  mutation: MutationLike;
}

type InstructorFormProps = InstructorFormCreateProps | InstructorFormEditProps;

export function InstructorForm({
  instructor,
  onSubmit,
  isPending,
  mutation,
}: InstructorFormProps) {
  const isEditing = !!instructor;

  if (isEditing) {
    return (
      <Form<UpdateInstructorSchema>
        schema={updateInstructorSchema}
        onSubmit={(data, form) =>
          onSubmit(
            pickDirtyFields(
              data,
              form.formState.dirtyFields,
            ) as UpdateInstructorSchema,
          )
        }
        defaultValues={{
          name: instructor.name,
          lastname: instructor.lastname,
          phone: instructor.phone ?? "",
          emergencyPhone: instructor.emergencyPhone ?? "",
          address: instructor.address ?? "",
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField<UpdateInstructorSchema>
            name="name"
            label="Nombre"
            required
          >
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Nombre del profesor"
                leftElement={<User size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<UpdateInstructorSchema>
            name="lastname"
            label="Apellido"
            required
          >
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Apellido del profesor"
                leftElement={<User size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <div>
            <Label htmlFor="instructor-dni" className="mb-1.5 block">
              DNI
            </Label>
            <Input
              id="instructor-dni"
              value={instructor.dni}
              type="text"
              disabled
              leftElement={<Mail size={16} aria-hidden="true" />}
            />
            <p className="mt-1 text-xs text-neutral-400">
              El DNI no se puede modificar.
            </p>
          </div>

          <div>
            <Label htmlFor="instructor-email" className="mb-1.5 block">
              Email
            </Label>
            <Input
              id="instructor-email"
              value={instructor.email}
              type="email"
              disabled
              leftElement={<Mail size={16} aria-hidden="true" />}
            />
            <p className="mt-1 text-xs text-neutral-400">
              El email no se puede modificar.
            </p>
          </div>

          <FormField<UpdateInstructorSchema> name="phone" label="Teléfono">
            {(field) => <PhoneInput {...field} />}
          </FormField>

          <FormField<UpdateInstructorSchema>
            name="emergencyPhone"
            label="Teléfono de emergencia"
          >
            {(field) => <PhoneInput {...field} />}
          </FormField>

          <FormField<UpdateInstructorSchema> name="address" label="Dirección">
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Dirección del profesor"
                leftElement={<Home size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormImage<UpdateInstructorSchema>
            name="image"
            label="Foto de perfil"
            initialPreview={instructor.image ?? null}
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
    <Form<RegisterInstructorSchema>
      schema={registerInstructorSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterInstructorSchema)
      }
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField<RegisterInstructorSchema>
          name="name"
          label="Nombre"
          required
        >
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Nombre del profesor"
              leftElement={<User size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterInstructorSchema>
          name="lastname"
          label="Apellido"
          required
        >
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Apellido del profesor"
              leftElement={<User size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterInstructorSchema> name="dni" label="DNI" required>
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Documento del profesor"
              inputMode="numeric"
              maxLength={8}
              leftElement={<CreditCard size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterInstructorSchema>
          name="email"
          label="Email"
          required
        >
          {(field) => (
            <Input
              {...field}
              type="email"
              placeholder="Email del profesor"
              leftElement={<Mail size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterInstructorSchema> name="phone" label="Teléfono">
          {(field) => <PhoneInput {...field} />}
        </FormField>

        <FormField<RegisterInstructorSchema>
          name="emergencyPhone"
          label="Teléfono de emergencia"
        >
          {(field) => <PhoneInput {...field} />}
        </FormField>

        <FormField<RegisterInstructorSchema> name="address" label="Dirección">
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Dirección del profesor"
              leftElement={<Home size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormImage<RegisterInstructorSchema>
          name="image"
          label="Foto de perfil"
        />
      </div>

      <FormError mutation={mutation} />

      <Button
        type="submit"
        intent="primary"
        className="mt-2 w-full"
        isLoading={isPending}
      >
        Registrar profesor
      </Button>
    </Form>
  );
}

InstructorForm.displayName = "InstructorForm";
