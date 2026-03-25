import { Mail, User, CreditCard } from "lucide-react";
import { Button, Input } from "@shared/ui";
import { Form, FormField } from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
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
        onSubmit={onSubmit as (data: UpdateInstructorSchema) => void}
        mutation={mutation}
        defaultValues={{
          name: instructor.name,
          lastname: instructor.lastname,
          dni: instructor.dni,
        }}
        className="flex flex-col gap-5"
      >
        <FormField<UpdateInstructorSchema> name="name" label="Nombre" required>
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
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <Input
            value={instructor.email}
            type="email"
            disabled
            leftElement={<Mail size={16} aria-hidden="true" />}
          />
          <p className="mt-1 text-xs text-neutral-400">
            El email no se puede modificar.
          </p>
        </div>

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
      onSubmit={onSubmit as (data: RegisterInstructorSchema) => void}
      mutation={mutation}
      className="flex flex-col gap-5"
    >
      <FormField<RegisterInstructorSchema> name="name" label="Nombre" required>
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

      <FormField<RegisterInstructorSchema> name="email" label="Email" required>
        {(field) => (
          <Input
            {...field}
            type="email"
            placeholder="profesor@email.com"
            leftElement={<Mail size={16} aria-hidden="true" />}
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

      <Button
        type="submit"
        intent="primary"
        className="mt-2 w-full"
        isLoading={isPending}
      >
        Crear profesor
      </Button>
    </Form>
  );
}

InstructorForm.displayName = "InstructorForm";
