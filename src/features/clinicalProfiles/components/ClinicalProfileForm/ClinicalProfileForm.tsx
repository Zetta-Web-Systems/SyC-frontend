import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import type { RiskFlag } from "@features/riskFlags";
import { buildDefaults } from "../../lib/formTransformers";
import {
  clinicalProfileFormSchema,
  type ClinicalProfileFormSchema,
} from "../../schemas/clinicalProfile.schema";
import type { ClinicalProfile } from "../../types";
import { ClinicalProfileBodyPreview } from "../ClinicalProfileBody";
import { ClinicalProfileFormActions } from "./ClinicalProfileFormActions";
import { GeneralObservationsField } from "./ClinicalProfileFormFields";
import { MemberRiskFlagsSection } from "./MemberRiskFlagsSection";

interface ClinicalProfileFormProps {
  profile: ClinicalProfile | ClinicalProfileFormSchema | null;
  availableRiskFlags: RiskFlag[];
  onSubmit: (
    data: ClinicalProfileFormSchema,
    form: UseFormReturn<ClinicalProfileFormSchema>,
  ) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
  submitLabel?: string;
}

export function ClinicalProfileForm({
  profile,
  availableRiskFlags,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
  submitLabel = "Guardar perfil clínico",
}: ClinicalProfileFormProps) {
  return (
    <Form<ClinicalProfileFormSchema>
      schema={clinicalProfileFormSchema}
      onSubmit={(data, form) => onSubmit(data, form)}
      defaultValues={buildDefaults(profile)}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <GeneralObservationsField />
          <MemberRiskFlagsSection availableRiskFlags={availableRiskFlags} />
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <ClinicalProfileBodyPreview />
        </aside>
      </div>

      <FormUnsavedChangesGuard active={guardUnsavedChanges} />
      <FormError mutation={mutation} />
      <ClinicalProfileFormActions
        onCancel={onCancel}
        isPending={isPending}
        submitLabel={submitLabel}
      />
    </Form>
  );
}

ClinicalProfileForm.displayName = "ClinicalProfileForm";
