import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText, RotateCcw, X } from "lucide-react";
import { Button, IconButton } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { toast } from "@shared/stores/toast.store";
import { TrainingPlanForm } from "../components/TrainingPlanForm/TrainingPlanForm";
import { LoadTemplateModal } from "../components/TrainingPlanForm/LoadTemplateModal/LoadTemplateModal";
import { useRegisterTrainingPlanSubmit } from "../hooks/useRegisterTrainingPlanSubmit";
import { useTrainingPlanDraft } from "../stores/trainingPlanDraft.store";
import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";

const GUARD_ALLOW_NAVIGATION_TO = [
  "/exercises/register",
  "/members/$memberId/clinical-profile",
];

interface RegisterTrainingPlanPageProps {
  createdExerciseId?: string;
  resume?: boolean;
}

export default function RegisterTrainingPlanPage({
  createdExerciseId,
  resume,
}: RegisterTrainingPlanPageProps) {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [templateValues, setTemplateValues] =
    useState<RegisterTrainingPlanFormSchema | null>(null);

  const draft = useTrainingPlanDraft((s) => s.draft);
  const savedAt = useTrainingPlanDraft((s) => s.savedAt);
  const clearDraft = useTrainingPlanDraft((s) => s.clear);

  const isTransientReturn = Boolean(createdExerciseId) || resume === true;
  const hasSavedDraft = draft !== null && savedAt !== null;
  const shouldResume = isTransientReturn || hasSavedDraft;
  const showResumeBanner =
    hasSavedDraft && !isTransientReturn && !bannerDismissed;

  useEffect(() => {
    if (!shouldResume) clearDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToList() {
    clearDraft();
    flushSync(() => setNavigating(true));
    void navigate({ to: "/training-plans" });
  }

  function handleLeave() {
    void navigate({ to: "/training-plans" });
  }

  function handleCancel() {
    clearDraft();
    void navigate({ to: "/training-plans" });
  }

  function handleSaveAndExit() {
    flushSync(() => setNavigating(true));
    void navigate({ to: "/training-plans" });
  }

  function handleDiscardDraft() {
    confirm({
      intent: "warning",
      title: "Descartar borrador",
      description:
        "Vas a empezar la planificación de cero y se perderá el borrador guardado. ¿Seguro?",
      confirmLabel: "Descartar",
      onConfirm: () => {
        clearDraft();
        setTemplateValues(null);
        setRemountKey((k) => k + 1);
      },
    });
  }

  const handleApplyTemplate = useCallback(
    (values: RegisterTrainingPlanFormSchema) => {
      confirm({
        intent: "warning",
        title: "Cargar plantilla",
        description:
          "Se reemplazará el contenido actual del formulario con el de la plantilla seleccionada. ¿Querés continuar?",
        confirmLabel: "Cargar plantilla",
        onConfirm: () => {
          clearDraft();
          setTemplateValues(values);
          setBannerDismissed(true);
          setRemountKey((k) => k + 1);
          setLoadTemplateOpen(false);
          toast.success("Plantilla cargada", {
            description: "Revisá los bloques y días, y asigná un alumno.",
          });
        },
      });
    },
    [clearDraft],
  );

  const { isPending, mutation, handleSubmit } = useRegisterTrainingPlanSubmit({
    onSuccess: goToList,
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Registrar planificación"
        description="Diseñá los bloques, días y ejercicios de la planificación"
        actions={
          <div className="flex gap-2">
            <Button
              intent="neutral"
              variant="outline"
              onClick={() => setLoadTemplateOpen(true)}
            >
              <FileText size={16} aria-hidden="true" />
              <span className="hidden xs:inline">Cargar plantilla</span>
            </Button>
            <Button intent="neutral" variant="outline" onClick={handleLeave}>
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="hidden xs:inline">Volver</span>
            </Button>
          </div>
        }
      />

      {showResumeBanner && (
        <div className="flex flex-col gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="font-medium text-primary-800">
            Estás retomando un borrador guardado.
          </p>
          <div className="flex items-center gap-1.5 sm:shrink-0">
            <Button
              intent="neutral"
              variant="outline"
              size="sm"
              onClick={handleDiscardDraft}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Descartar y empezar de cero
            </Button>
            <IconButton
              size="sm"
              aria-label="Ocultar aviso"
              onClick={() => setBannerDismissed(true)}
            >
              <X size={16} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      )}

      <TrainingPlanForm
        key={remountKey}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isPending={isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
        guardAllowNavigationTo={GUARD_ALLOW_NAVIGATION_TO}
        defaultValues={
          templateValues ?? (shouldResume ? (draft ?? undefined) : undefined)
        }
        restore={templateValues ? false : shouldResume}
        autoAddExerciseId={createdExerciseId}
        onSaveAndExit={handleSaveAndExit}
      />

      <LoadTemplateModal
        open={loadTemplateOpen}
        onClose={() => setLoadTemplateOpen(false)}
        onApply={handleApplyTemplate}
      />
    </div>
  );
}
