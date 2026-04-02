import { Mail, User, CreditCard, Home, Phone } from "lucide-react";
import { Button, Input, Label } from "@shared/ui";
import { Form, FormField, FormError, FormImage } from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import {
  registerInstructorSchema,
  updateInstructorSchema,
  type RegisterInstructorSchema,
  type UpdateInstructorSchema,
} from "../../schemas/instructor.schema";
import type { Instructor } from "../../types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";

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
        onSubmit={(data) =>
          onSubmit(normalizeEmptyStrings(data) as UpdateInstructorSchema)
        }
        defaultValues={{
          name: instructor.name,
          lastname: instructor.lastname,
          dni: instructor.dni,
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

          <FormField<UpdateInstructorSchema> name="dni" label="DNI" required>
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
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Teléfono"
                leftElement={<Phone size={16} aria-hidden="true" />}
              />
            )}
          </FormField>

          <FormField<UpdateInstructorSchema>
            name="emergencyPhone"
            label="Teléfono de emergencia"
          >
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Teléfono de emergencia"
                leftElement={<Phone size={16} aria-hidden="true" />}
              />
            )}
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

          <div className="col-span-1 md:col-span-2">
            <FormImage<UpdateInstructorSchema>
              name="image"
              label="Foto de perfil"
              initialPreview={instructor.image ?? null}
            />
          </div>
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
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Teléfono"
              leftElement={<Phone size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<RegisterInstructorSchema>
          name="emergencyPhone"
          label="Teléfono de emergencia"
        >
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Teléfono de emergencia"
              leftElement={<Phone size={16} aria-hidden="true" />}
            />
          )}
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

        <div className="col-span-1 md:col-span-2">
          <FormImage<RegisterInstructorSchema>
            name="image"
            label="Foto de perfil"
          />
        </div>
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
