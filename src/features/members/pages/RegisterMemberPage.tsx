import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { toClinicalProfileRegisterPayload } from "@features/clinicalProfiles";
import { MemberForm } from "../components/MembersList/MemberForm/MemberForm";
import { ClinicalProfileSlotButton } from "../components/MembersList/MemberForm/ClinicalProfileSlotButton";
import { useRegisterMemberMutation } from "../hooks/mutations/useRegisterMemberMutation";
import { useMemberRegistrationDraft } from "../stores/memberRegistrationDraft.store";
import type { RegisterMemberSchema } from "../schemas/member.schema";

export default function RegisterMemberPage() {
  const navigate = useNavigate();
  const mutation = useRegisterMemberMutation();
  const [navigating, setNavigating] = useState(false);

  const memberFields = useMemberRegistrationDraft((s) => s.memberFields);
  const clinicalProfile = useMemberRegistrationDraft((s) => s.clinicalProfile);
  const reset = useMemberRegistrationDraft((s) => s.reset);

  function goToList() {
    reset();
    flushSync(() => setNavigating(true));
    navigate({ to: "/members" });
  }

  function handleBack() {
    reset();
    navigate({ to: "/members" });
  }

  function performRegister(data: RegisterMemberSchema) {
    const normalized = {
      ...data,
      image: data.image ?? undefined,
      currentWeight: data.currentWeight ?? undefined,
      trainingGoal: data.trainingGoal ?? undefined,
      clinicalProfile: clinicalProfile
        ? toClinicalProfileRegisterPayload(clinicalProfile)
        : {},
    };
    mutation.mutate(normalized, {
      onSuccess: () => goToList(),
    });
  }

  function handleRegister(data: RegisterMemberSchema) {
    const missingPhones: string[] = [];
    if (!data.phone) missingPhones.push("teléfono");
    if (!data.emergencyPhone) missingPhones.push("teléfono de emergencia");
    const missingPhonesNotice =
      missingPhones.length > 0
        ? ` Estás registrando al alumno sin ${missingPhones.join(" y sin ")}.`
        : "";

    confirm({
      intent: missingPhones.length > 0 ? "warning" : "info",
      title: "Registrar alumno",
      description: `¿Estás seguro que deseas registrar el alumno?${missingPhonesNotice}`,
      confirmLabel: "Registrar",
      onConfirm: () => performRegister(data),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Registrar alumno"
        description="Completa la información para registrar un nuevo alumno."
        actions={
          <Button variant="outline" intent="neutral" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

      <MemberForm
        onSubmit={handleRegister}
        onCancel={handleBack}
        isPending={mutation.isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
        guardAllowNavigationTo={["/members/register/clinical-profile"]}
        defaultValues={memberFields ?? undefined}
        clinicalProfileSlot={<ClinicalProfileSlotButton />}
      />
    </div>
  );
}
