import type { ReactNode } from "react";
import type { DefaultValues } from "react-hook-form";
import {
  Form,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import { buildMemberUpdateDefaults } from "../../../lib/memberFormTransformers";
import {
  registerMemberSchema,
  updateMemberSchema,
  type RegisterMemberSchema,
  type UpdateMemberSchema,
} from "../../../schemas/member.schema";
import type { Member } from "../../../types";
import { MemberFormActions } from "./MemberFormActions";
import { MemberFormFields } from "./MemberFormFields";

interface MemberFormCreateProps {
  member?: undefined;
  onSubmit: (data: RegisterMemberSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
  guardAllowNavigationTo?: string[];
  clinicalProfileSlot?: ReactNode;
  defaultValues?: DefaultValues<RegisterMemberSchema>;
}

interface MemberFormEditProps {
  member: Member;
  onSubmit: (data: UpdateMemberSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
  guardAllowNavigationTo?: string[];
  clinicalProfileSlot?: ReactNode;
}

type MemberFormProps = MemberFormCreateProps | MemberFormEditProps;

export function MemberForm({
  member,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
  guardAllowNavigationTo,
  clinicalProfileSlot,
  ...rest
}: MemberFormProps) {
  const createDefaults = !member
    ? (rest as MemberFormCreateProps).defaultValues
    : undefined;

  const submitLabel = member ? "Guardar cambios" : "Registrar alumno";

  const body = (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <MemberFormFields
          mode={member ? "edit" : "create"}
          dni={member?.dni}
          initialImagePreview={member?.image ?? null}
        />

        {clinicalProfileSlot && (
          <aside className="lg:sticky lg:top-4">{clinicalProfileSlot}</aside>
        )}
      </div>

      <FormUnsavedChangesGuard
        active={guardUnsavedChanges}
        allowNavigationTo={guardAllowNavigationTo}
      />

      <FormError mutation={mutation} />

      <MemberFormActions
        onCancel={onCancel}
        isPending={isPending}
        submitLabel={submitLabel}
      />
    </>
  );

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
        defaultValues={buildMemberUpdateDefaults(member)}
        className="flex flex-col gap-5"
      >
        {body}
      </Form>
    );
  }

  return (
    <Form<RegisterMemberSchema>
      schema={registerMemberSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterMemberSchema)
      }
      defaultValues={createDefaults}
      className="flex flex-col gap-5"
    >
      {body}
    </Form>
  );
}

MemberForm.displayName = "MemberForm";
