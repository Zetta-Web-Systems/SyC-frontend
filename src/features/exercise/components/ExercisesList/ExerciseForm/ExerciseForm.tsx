import {
  Form,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import {
  registerExerciseSchema,
  updateExerciseSchema,
  type RegisterExerciseSchema,
  type UpdateExerciseSchema,
} from "../../../schemas/exercise.schema";
import type { Exercise, ExerciseGroup } from "../../../types";
import { ExerciseFormActions } from "./ExerciseFormActions";
import { ExerciseFormFields } from "./ExerciseFormFields";

export interface ExerciseFormHelpers {
  resetPreservingGroup: () => void;
}

interface ExerciseFormCreateProps {
  exercise?: undefined;
  initialGroupId: string;
  initialName?: string;
  groups: ExerciseGroup[];
  isLoadingGroups?: boolean;
  onGroupSearch?: (q: string) => void;
  onGroupCreated?: (group: ExerciseGroup) => void;
  onSubmit: (
    data: RegisterExerciseSchema,
    helpers: ExerciseFormHelpers,
  ) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
  createMore: boolean;
  onCreateMoreChange: (value: boolean) => void;
}

interface ExerciseFormEditProps {
  exercise: Exercise;
  initialGroupId: string;
  groups: ExerciseGroup[];
  isLoadingGroups?: boolean;
  onGroupSearch?: (q: string) => void;
  onGroupCreated?: (group: ExerciseGroup) => void;
  onSubmit: (data: UpdateExerciseSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

type ExerciseFormProps = ExerciseFormCreateProps | ExerciseFormEditProps;

export function ExerciseForm(props: ExerciseFormProps) {
  if (props.exercise) {
    return <EditExerciseForm {...props} />;
  }
  return <CreateExerciseForm {...props} />;
}

ExerciseForm.displayName = "ExerciseForm";

function CreateExerciseForm({
  initialGroupId,
  initialName,
  groups,
  isLoadingGroups,
  onGroupSearch,
  onGroupCreated,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
  createMore,
  onCreateMoreChange,
}: ExerciseFormCreateProps) {
  const initialGroup = groups.find((g) => g.id === initialGroupId);
  const initialZones = initialGroup?.affectedZones ?? [];

  return (
    <Form<RegisterExerciseSchema>
      schema={registerExerciseSchema}
      onSubmit={(data, form) => {
        const cleaned = normalizeEmptyStrings(data) as RegisterExerciseSchema;
        const helpers: ExerciseFormHelpers = {
          resetPreservingGroup: () => {
            const current = form.getValues();
            const grp = groups.find((g) => g.id === current.exerciseGroupId);
            form.reset({
              exerciseGroupId: current.exerciseGroupId,
              affectedZones: grp?.affectedZones ?? current.affectedZones ?? [],
              name: "",
              exerciseLevel: undefined,
              technicalDescription: "",
              links: [],
              notes: "",
            });
          },
        };
        onSubmit(cleaned, helpers);
      }}
      defaultValues={{
        exerciseGroupId: initialGroupId,
        name: initialName ?? "",
        affectedZones: initialZones,
        links: [],
      }}
      className="flex flex-col gap-5"
    >
      <ExerciseFormFields
        groups={groups}
        isLoadingGroups={isLoadingGroups}
        onGroupSearch={onGroupSearch}
        onGroupCreated={onGroupCreated}
      />

      <FormUnsavedChangesGuard active={guardUnsavedChanges} />
      <FormError mutation={mutation} />

      <ExerciseFormActions
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Registrar ejercicio"
        createMore={{
          value: createMore,
          onChange: onCreateMoreChange,
        }}
      />
    </Form>
  );
}

function EditExerciseForm({
  exercise,
  initialGroupId,
  groups,
  isLoadingGroups,
  onGroupSearch,
  onGroupCreated,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
}: ExerciseFormEditProps) {
  return (
    <Form<UpdateExerciseSchema>
      schema={updateExerciseSchema}
      onSubmit={(data, form) =>
        onSubmit(
          pickDirtyFields(
            data,
            form.formState.dirtyFields,
          ) as UpdateExerciseSchema,
        )
      }
      defaultValues={{
        exerciseGroupId: initialGroupId,
        name: exercise.name,
        exerciseLevel: exercise.exerciseLevel,
        affectedZones: exercise.affectedZones ?? [],
        technicalDescription: exercise.technicalDescription ?? "",
        links: exercise.links ?? [],
        notes: exercise.notes ?? "",
      }}
      className="flex flex-col gap-5"
    >
      <ExerciseFormFields
        groups={groups}
        exercise={exercise}
        isLoadingGroups={isLoadingGroups}
        onGroupSearch={onGroupSearch}
        onGroupCreated={onGroupCreated}
      />

      <FormUnsavedChangesGuard active={guardUnsavedChanges} />
      <FormError mutation={mutation} />

      <ExerciseFormActions
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Guardar cambios"
      />
    </Form>
  );
}
