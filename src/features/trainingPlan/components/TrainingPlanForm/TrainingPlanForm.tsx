import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DayName } from "../../constants";
import {
  Form,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import { toast } from "@shared/stores/toast.store";
import { confirm } from "@shared/stores/confirm.store";
import { formatDateToISO } from "@shared/utils/date.utils";
import { useMemberQuery, type Member } from "@features/members";
import {
  registerTrainingPlanFormSchema,
  type RegisterTrainingPlanFormSchema,
} from "../../schemas/registerTrainingPlan.schema";
import { useTrainingPlanDraft } from "../../stores/trainingPlanDraft.store";
import { useSaveTrainingPlanDraft } from "../../hooks/form/useSaveTrainingPlanDraft";
import { useDurationExecsSync } from "../../hooks/form/useDurationExecsSync";
import { useAutoGenerateInitialDays } from "../../hooks/form/useAutoGenerateInitialDays";
import { useTrainingPlanFormHelpers } from "../../hooks/form/useTrainingPlanFormHelpers";
import { useNavigateToFirstError } from "../../hooks/form/useNavigateToFirstError";
import { useTrainingPlanDnd } from "../../hooks/form/useTrainingPlanDnd";
import { DRAG_TYPE } from "../../lib/trainingPlanDnd";
import { TrainingPlanMetaBar } from "./TrainingPlanMetaBar/TrainingPlanMetaBar";
import { TrainingPlanOB } from "./TrainingPlanOB/TrainingPlanOB";
import { TrainingDaysEditor } from "./TrainingDaysEditor/TrainingDaysEditor";
import { ExerciseLibrary } from "./ExerciseLibrary/ExerciseLibrary";
import { ExerciseLibraryCardOverlay } from "./ExerciseLibrary/ExerciseLibraryCard/ExerciseLibraryCardOverlay";
import { ExerciseRowOverlay } from "./TrainingDaysEditor/ExerciseRow/ExerciseRowOverlay";
import { TrainingPlanFormActions } from "./TrainingPlanFormActions/TrainingPlanFormActions";

const DEFAULT_VALUES: RegisterTrainingPlanFormSchema = {
  mode: "plan",
  memberId: "",
  startDate: formatDateToISO(new Date()),
  durationInWeeks: 4,
  daysPerWeek: 3,
  mobilityBlock: "",
  preparatoryBlock: "",
  aerobicBlock: "",
  trainingDays: [],
};

const DEFAULT_FORM_ID = "training-plan-form";

interface TrainingPlanFormProps {
  id?: string;
  onSubmit: (data: RegisterTrainingPlanFormSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
  guardAllowNavigationTo?: string[];
  defaultValues?: RegisterTrainingPlanFormSchema;
  restore?: boolean;
  autoAddExerciseId?: string;
  onSaveAndExit?: () => void;
}

export function TrainingPlanForm({
  id = DEFAULT_FORM_ID,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
  guardAllowNavigationTo,
  defaultValues,
  restore = false,
  autoAddExerciseId,
  onSaveAndExit,
}: TrainingPlanFormProps) {
  return (
    <Form<RegisterTrainingPlanFormSchema>
      id={id}
      schema={registerTrainingPlanFormSchema}
      defaultValues={defaultValues ?? DEFAULT_VALUES}
      onSubmit={(data) => onSubmit(data)}
      reValidateMode="onChange"
      className="flex flex-col gap-4"
    >
      <TrainingPlanFormBody
        formId={id}
        onCancel={onCancel}
        isPending={isPending}
        mutation={mutation}
        guardUnsavedChanges={guardUnsavedChanges}
        guardAllowNavigationTo={guardAllowNavigationTo}
        restore={restore}
        autoAddExerciseId={autoAddExerciseId}
        onSaveAndExit={onSaveAndExit}
      />
    </Form>
  );
}

TrainingPlanForm.displayName = "TrainingPlanForm";

interface TrainingPlanFormBodyProps {
  formId: string;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges: boolean;
  guardAllowNavigationTo?: string[];
  restore: boolean;
  autoAddExerciseId?: string;
  onSaveAndExit?: () => void;
}

function TrainingPlanFormBody({
  formId,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges,
  guardAllowNavigationTo,
  restore,
  autoAddExerciseId,
  onSaveAndExit,
}: TrainingPlanFormBodyProps) {
  useDurationExecsSync();
  useAutoGenerateInitialDays();
  const { addExercise } = useTrainingPlanFormHelpers();
  const { saveDraft } = useSaveTrainingPlanDraft();

  const draftMemberId = useTrainingPlanDraft((s) => s.selectedMemberId);
  const draftActiveDayName = useTrainingPlanDraft((s) => s.activeDayName);
  const restoredMemberId = restore ? draftMemberId : null;
  const restoredActiveDayName = restore ? draftActiveDayName : null;
  const { data: restoredMember } = useMemberQuery(
    restoredMemberId ?? undefined,
  );

  const [pickedMember, setPickedMember] = useState<Member | null>(null);
  const selectedMember = pickedMember ?? restoredMember ?? null;
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activeDayName, setActiveDayName] = useState<DayName | null>(
    restoredActiveDayName,
  );

  const autoAddedRef = useRef(false);
  useEffect(() => {
    if (autoAddedRef.current) return;
    if (!autoAddExerciseId || !restoredActiveDayName) return;
    addExercise(restoredActiveDayName, { exercise: { id: autoAddExerciseId } });
    autoAddedRef.current = true;
  }, [autoAddExerciseId, restoredActiveDayName, addExercise]);

  useNavigateToFirstError({ onActivateDay: setActiveDayName });

  const {
    sensors,
    collisionDetection,
    activeDrag,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useTrainingPlanDnd({ onActiveDayChange: setActiveDayName });

  const persistResumableDraft = () => {
    saveDraft(activeDayName);
    toast.success("Borrador guardado", {
      description: "Vas a poder retomar la planificación cuando quieras.",
    });
  };

  const requestSaveAndExit = onSaveAndExit
    ? () => {
        confirm({
          intent: "info",
          title: "Guardar y salir",
          description:
            "Se guarda como borrador para que retomes la planificación cuando quieras. Todavía no se registra.",
          confirmLabel: "Guardar y salir",
          cancelLabel: "Cancelar",
          onConfirm: () => {
            persistResumableDraft();
            onSaveAndExit();
          },
        });
      }
    : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <TrainingPlanMetaBar
        selectedMember={selectedMember}
        onSelectMember={setPickedMember}
      />

      <TrainingPlanOB />
      <TrainingDaysEditor
        activeDayName={activeDayName}
        onActiveDayChange={setActiveDayName}
        isDragging={activeDrag !== null}
        activeDragType={activeDrag?.type ?? null}
        onOpenLibrary={() => setLibraryOpen(true)}
      />

      <FormUnsavedChangesGuard
        active={guardUnsavedChanges}
        allowNavigationTo={guardAllowNavigationTo}
        onSaveAndLeave={onSaveAndExit ? persistResumableDraft : undefined}
      />
      <FormError mutation={mutation} />

      <TrainingPlanFormActions
        formId={formId}
        onCancel={onCancel}
        isPending={isPending}
        onOpenLibrary={() => setLibraryOpen(true)}
        onSaveAndExit={requestSaveAndExit}
      />

      <ExerciseLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        activeDayName={activeDayName}
      />

      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeDrag?.type === DRAG_TYPE.LIBRARY && (
            <ExerciseLibraryCardOverlay exercise={activeDrag.exercise} />
          )}
          {activeDrag?.type === DRAG_TYPE.ROW && (
            <ExerciseRowOverlay exerciseId={activeDrag.exerciseId} />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
