import { Button } from "@shared/ui";
import {
  Form,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
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
import { MemberFormFields } from "./MemberFormFields";

interface MemberFormCreateProps {
  member?: undefined;
  onSubmit: (data: RegisterMemberSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

interface MemberFormEditProps {
  member: Member;
  onSubmit: (data: UpdateMemberSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

type MemberFormProps = MemberFormCreateProps | MemberFormEditProps;

export function MemberForm({
  member,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
}: MemberFormProps) {
  if (member) {
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
        <MemberFormFields mode="edit" dni={member.dni} />

        <FormUnsavedChangesGuard active={guardUnsavedChanges} />

        <FormError mutation={mutation} />

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            intent="neutral"
            variant="outline"
            onClick={onCancel}
          >
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
    <Form<RegisterMemberSchema>
      schema={registerMemberSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterMemberSchema)
      }
      className="flex flex-col gap-5"
    >
      <MemberFormFields mode="create" />

      <FormUnsavedChangesGuard active={guardUnsavedChanges} />

      <FormError mutation={mutation} />

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          intent="neutral"
          variant="outline"
          onClick={onCancel}
        >
          Volver
        </Button>
        <Button type="submit" intent="primary" isLoading={isPending}>
          Registrar alumno
        </Button>
      </div>
    </Form>
  );
}

MemberForm.displayName = "MemberForm";
