import { Dumbbell } from "lucide-react";
import { Button, Input } from "@shared/ui";
import {
  Form,
  FormField,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import { BodyZoneSelector } from "@shared/components/BodyZoneSelector";
import type { BodyZone } from "@shared/types/bodyZone.types";
import {
  registerGroupExerciseSchema,
  updateGroupExerciseSchema,
  type RegisterGroupExerciseSchema,
  type UpdateGroupExerciseSchema,
} from "../../../schemas/groupExercise.schema";
import type { ExerciseGroup } from "../../../types";

interface GroupExerciseFormCreateProps {
  group?: undefined;
  defaultName?: string;
  onSubmit: (data: RegisterGroupExerciseSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

interface GroupExerciseFormEditProps {
  group: ExerciseGroup;
  defaultName?: string;
  onSubmit: (data: UpdateGroupExerciseSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

type GroupExerciseFormProps =
  | GroupExerciseFormCreateProps
  | GroupExerciseFormEditProps;

export function GroupExerciseForm({
  group,
  defaultName,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
}: GroupExerciseFormProps) {
  const isEditing = !!group;

  if (isEditing) {
    return (
      <Form<UpdateGroupExerciseSchema>
        schema={updateGroupExerciseSchema}
        onSubmit={(data, form) =>
          onSubmit(
            pickDirtyFields(
              data,
              form.formState.dirtyFields,
            ) as UpdateGroupExerciseSchema,
          )
        }
        defaultValues={{
          name: group.name,
          affectedZones: group.affectedZones ?? [],
        }}
        className="flex flex-col gap-5"
      >
        <FormField<UpdateGroupExerciseSchema>
          name="name"
          label="Nombre"
          required
        >
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Nombre del grupo de ejercicios"
              leftElement={<Dumbbell size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<UpdateGroupExerciseSchema>
          name="affectedZones"
          label="Zonas afectadas"
        >
          {(field) => (
            <BodyZoneSelector
              id={field.id}
              value={(field.value as BodyZone[] | undefined) ?? []}
              onChange={field.onChange}
              error={field.error}
              aria-describedby={field["aria-describedby"]}
              disabled={field.disabled}
            />
          )}
        </FormField>

        <FormUnsavedChangesGuard active={guardUnsavedChanges} />

        <FormError mutation={mutation} />

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button intent="neutral" variant="outline" onClick={onCancel}>
            Volver
          </Button>
          <Button type="submit" intent="primary" isLoading={isPending}>
            Guardar cambios
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form<RegisterGroupExerciseSchema>
      schema={registerGroupExerciseSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterGroupExerciseSchema)
      }
      defaultValues={{ name: defaultName ?? "" }}
      className="flex flex-col gap-5"
    >
      <FormField<RegisterGroupExerciseSchema>
        name="name"
        label="Nombre"
        required
      >
        {(field) => (
          <Input
            {...field}
            type="text"
            placeholder="Nombre del grupo de ejercicios"
            leftElement={<Dumbbell size={16} aria-hidden="true" />}
          />
        )}
      </FormField>

      <FormField<RegisterGroupExerciseSchema>
        name="affectedZones"
        label="Zonas afectadas"
      >
        {(field) => (
          <BodyZoneSelector
            id={field.id}
            value={(field.value as BodyZone[] | undefined) ?? []}
            onChange={field.onChange}
            error={field.error}
            aria-describedby={field["aria-describedby"]}
            disabled={field.disabled}
          />
        )}
      </FormField>

      <FormUnsavedChangesGuard active={guardUnsavedChanges} />

      <FormError mutation={mutation} />

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button intent="neutral" variant="outline" onClick={onCancel}>
          Volver
        </Button>
        <Button type="submit" intent="primary" isLoading={isPending}>
          Registrar grupo de ejercicios
        </Button>
      </div>
    </Form>
  );
}

GroupExerciseForm.displayName = "GroupExerciseForm";
