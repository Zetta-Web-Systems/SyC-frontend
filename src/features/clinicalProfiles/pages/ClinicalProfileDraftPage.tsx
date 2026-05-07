import { useState } from "react";
import { flushSync } from "react-dom";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import type { MutationLike } from "@shared/types/mutations.types";
import { ClinicalProfileForm } from "../components/ClinicalProfileForm";
import { NewStatusesPreviewList } from "../components/ClinicalProfileForm/NewStatusesPreviewList";
import { useClinicalProfileDraftGuard } from "../hooks/useClinicalProfileDraftGuard";
import { buildNewStatusesPreview } from "../lib/newStatusesPreview";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";
import { useClinicalProfilePageData } from "./useClinicalProfilePageData";

const IDLE_MUTATION: MutationLike = { isError: false, error: null };

export default function ClinicalProfileDraftPage() {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);
  const { ready, clinicalProfile, setClinicalProfile } =
    useClinicalProfileDraftGuard();

  const { isLoading, isError, availableRiskFlags } =
    useClinicalProfilePageData();

  if (!ready) return null;

  function handleBack() {
    navigate({ to: "/members/register" });
  }

  function persist(
    data: ClinicalProfileFormSchema,
    form: UseFormReturn<ClinicalProfileFormSchema>,
  ) {
    setClinicalProfile(data);
    form.reset(data);
    flushSync(() => setNavigating(true));
    navigate({ to: "/members/register" });
  }

  function handleSubmit(
    data: ClinicalProfileFormSchema,
    form: UseFormReturn<ClinicalProfileFormSchema>,
  ) {
    const newStatuses = buildNewStatusesPreview({
      data,
      snapshot: null,
      availableRiskFlags,
    });
    if (newStatuses.length > 0) {
      confirm({
        intent: "warning",
        size: "md",
        title: "Confirmar estados clínicos",
        description:
          "Una vez guardados, el lado (izquierda/derecha) no se puede editar. Verificá los lados antes de continuar.",
        body: <NewStatusesPreviewList newStatuses={newStatuses} />,
        confirmLabel: "Confirmar y guardar",
        cancelLabel: "Volver a editar",
        onConfirm: () => persist(data, form),
      });
      return;
    }
    persist(data, form);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Perfil clínico"
        description="Completá la información clínica del alumno"
        actions={
          <Button intent="neutral" variant="outline" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver al registro</span>
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
          No se pudieron cargar las banderas de riesgo.
        </p>
      )}

      {!isLoading && !isError && (
        <ClinicalProfileForm
          profile={clinicalProfile}
          availableRiskFlags={availableRiskFlags}
          onSubmit={handleSubmit}
          onCancel={handleBack}
          isPending={false}
          mutation={IDLE_MUTATION}
          guardUnsavedChanges={!navigating}
        />
      )}
    </div>
  );
}
