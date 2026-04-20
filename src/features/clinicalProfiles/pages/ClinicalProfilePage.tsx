import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { ClinicalProfileForm } from "../components/ClinicalProfileForm";
import { useClinicalProfileSnapshot } from "../hooks/useClinicalProfileSnapshot";
import { useSaveClinicalProfile } from "../hooks/useSaveClinicalProfile";
import { useClinicalProfilePageData } from "./useClinicalProfilePageData";

interface ClinicalProfilePageProps {
  memberId: string;
}

export default function ClinicalProfilePage({
  memberId,
}: ClinicalProfilePageProps) {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  const {
    isLoading,
    isError,
    memberFullName,
    availableRiskFlags,
    profile,
    profileForForm,
  } = useClinicalProfilePageData(memberId);

  const { snapshotRef } = useClinicalProfileSnapshot(profile);

  const goBack = useCallback(() => {
    flushSync(() => setNavigating(true));
    navigate({ to: "/members/update/$memberId", params: { memberId } });
  }, [memberId, navigate]);

  const { submit, isSaving, mutation } = useSaveClinicalProfile({
    memberId,
    snapshotRef,
    onSuccess: goBack,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Perfil clínico"
        description={
          memberFullName
            ? `Información clínica de ${memberFullName}.`
            : "Información clínica del alumno."
        }
        actions={
          <Button intent="neutral" variant="outline" onClick={goBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver al alumno</span>
          </Button>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <p
          role="alert"
          className="rounded-xl border border-error bg-error/5 p-4 text-sm text-error"
        >
          No se pudo cargar el perfil clínico.
        </p>
      )}

      {!isLoading && !isError && profileForForm && (
        <ClinicalProfileForm
          profile={profileForForm}
          availableRiskFlags={availableRiskFlags}
          onSubmit={submit}
          onCancel={goBack}
          isPending={isSaving}
          mutation={mutation}
          guardUnsavedChanges={!navigating}
        />
      )}
    </div>
  );
}
