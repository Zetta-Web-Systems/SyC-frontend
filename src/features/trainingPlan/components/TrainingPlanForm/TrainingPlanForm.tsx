import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { DayName } from "../../constants";
import {
  Form,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import type { Member } from "@features/members";
import {
  registerTrainingPlanFormSchema,
  type RegisterTrainingPlanFormSchema,
} from "../../schemas/registerTrainingPlan.schema";
import { useDurationExecsSync } from "../../hooks/form/useDurationExecsSync";
import { useAutoGenerateInitialDays } from "../../hooks/form/useAutoGenerateInitialDays";
import { useTrainingPlanFormHelpers } from "../../hooks/form/useTrainingPlanFormHelpers";
import { useNavigateToFirstError } from "../../hooks/form/useNavigateToFirstError";
import {
  DRAG_TYPE,
  DROP_TYPE,
  type ActiveDragData,
  type DropData,
} from "../../lib/trainingPlanDnd";
import { TrainingPlanMetaBar } from "./TrainingPlanMetaBar/TrainingPlanMetaBar";
import { TrainingPlanOB } from "./TrainingPlanOB/TrainingPlanOB";
import { TrainingDaysEditor } from "./TrainingDaysEditor/TrainingDaysEditor";
import { ExerciseLibrary } from "./ExerciseLibrary/ExerciseLibrary";
import { ExerciseLibraryCardOverlay } from "./ExerciseLibrary/ExerciseLibraryCard/ExerciseLibraryCardOverlay";
import { ExerciseRowOverlay } from "./TrainingDaysEditor/ExerciseRow/ExerciseRowOverlay";
import { TrainingPlanFormActions } from "./TrainingPlanFormActions/TrainingPlanFormActions";

const TODAY_ISO = (): string => new Date().toISOString().slice(0, 10);

const DEFAULT_VALUES: RegisterTrainingPlanFormSchema = {
  mode: "plan",
  memberId: "",
  startDate: TODAY_ISO(),
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
}

export function TrainingPlanForm({
  id = DEFAULT_FORM_ID,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
}: TrainingPlanFormProps) {
  return (
    <Form<RegisterTrainingPlanFormSchema>
      id={id}
      schema={registerTrainingPlanFormSchema}
      defaultValues={DEFAULT_VALUES}
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
}

function TrainingPlanFormBody({
  formId,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges,
}: TrainingPlanFormBodyProps) {
  useDurationExecsSync();
  useAutoGenerateInitialDays();
  const { addExercise, reorderExercise } = useTrainingPlanFormHelpers();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activeDayName, setActiveDayName] = useState<DayName | null>(null);
  const [activeDrag, setActiveDrag] = useState<ActiveDragData | null>(null);

  useNavigateToFirstError({ onActivateDay: setActiveDayName });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const collisionDetection = useCallback<CollisionDetection>((args) => {
    const activeData = args.active.data.current as ActiveDragData | undefined;
    if (activeData?.type === DRAG_TYPE.LIBRARY) {
      return pointerWithin(args);
    }
    return closestCorners(args);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as ActiveDragData | undefined;
    if (data) setActiveDrag(data);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null);
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as ActiveDragData | undefined;
      const overData = over.data.current as DropData | undefined;
      if (!activeData || !overData) return;

      if (activeData.type === DRAG_TYPE.LIBRARY) {
        const targetDay =
          overData.type === DROP_TYPE.DAY_TAB ||
          overData.type === DROP_TYPE.DAY_LIST ||
          overData.type === DROP_TYPE.ROW
            ? overData.dayName
            : null;
        if (!targetDay) return;
        addExercise(targetDay, { exercise: activeData.exercise });
        setActiveDayName(targetDay);
        return;
      }

      if (activeData.type === DRAG_TYPE.ROW) {
        if (
          overData.type === DROP_TYPE.ROW &&
          overData.dayName === activeData.dayName
        ) {
          reorderExercise(activeData.dayName, activeData.order, overData.order);
        }
      }
    },
    [addExercise, reorderExercise],
  );

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
        onSelectMember={setSelectedMember}
      />

      <TrainingPlanOB />
      <TrainingDaysEditor
        activeDayName={activeDayName}
        onActiveDayChange={setActiveDayName}
        isDragging={activeDrag !== null}
        activeDragType={activeDrag?.type ?? null}
      />

      <FormUnsavedChangesGuard active={guardUnsavedChanges} />
      <FormError mutation={mutation} />

      <TrainingPlanFormActions
        formId={formId}
        onCancel={onCancel}
        isPending={isPending}
        onOpenLibrary={() => setLibraryOpen(true)}
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
