import { Button } from "@shared/ui";
import { Form, FormError } from "@shared/components/Form";
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
      <MemberFormFields mode="create" />

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
