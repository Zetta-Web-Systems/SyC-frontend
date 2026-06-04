import { useState } from "react";
import { Dumbbell } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, IconBox } from "@shared/ui";
import { ListState } from "@shared/components/ListState";
import { useTrainingPlanFormHelpers } from "../../../hooks/form/useTrainingPlanFormHelpers";
import { useTrainingPlanFormErrors } from "../../../hooks/form/useTrainingPlanFormErrors";
import { useTrainingPlanRiskStatuses } from "../../../hooks/ui/useTrainingPlanRiskStatuses";
import type { DayName } from "../../../constants";
import { rowId } from "../../../lib/trainingPlanDnd";
import { DayTabs } from "./DayTabs/DayTabs";
import { DayHeader } from "./DayHeader/DayHeader";
import { ExerciseRow } from "./ExerciseRow/ExerciseRow";
import { AddExerciseInline } from "./AddExerciseInline/AddExerciseInline";
import { DayDropZone } from "./DayDropZone";
import { ExerciseEditModal } from "./ExerciseEditModal";

interface TrainingDaysEditorProps {
  activeDayName: DayName | null;
  onActiveDayChange: (dayName: DayName | null) => void;
  isDragging: boolean;
  activeDragType: "library-exercise" | "day-row" | null;
}

export function TrainingDaysEditor({
  activeDayName: activeDayNameProp,
  onActiveDayChange,
  isDragging,
  activeDragType,
}: TrainingDaysEditorProps) {
  const { sortedDays, addDay, canAddDay } = useTrainingPlanFormHelpers();
  const { byDay, trainingDaysRoot } = useTrainingPlanFormErrors();
  const riskStatuses = useTrainingPlanRiskStatuses();

  const [editing, setEditing] = useState<{
    dayName: DayName;
    exerciseOrder: number;
  } | null>(null);
  const [addingForDay, setAddingForDay] = useState<DayName | null>(null);

  const activeDay =
    sortedDays.find((d) => d.dayName === activeDayNameProp) ??
    sortedDays[0] ??
    null;
  const activeDayName = activeDay?.dayName ?? null;
  const isAddingExercise =
    addingForDay !== null && addingForDay === activeDayName;

  function handleAddDay() {
    const created = addDay();
    if (created) onActiveDayChange(created);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center gap-2.5 border-b border-neutral-200 bg-linear-to-b from-white to-neutral-50/60 px-3 py-2.5">
          <IconBox size="sm" shape="md" tone="subtle" intent="primary">
            <Dumbbell size={16} aria-hidden="true" />
          </IconBox>
          <div className="flex-1">
            <div className="text-sm font-bold tracking-tight text-neutral-900">
              Musculación
            </div>
            <div className="mt-px text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              3° bloque
            </div>
          </div>
        </div>

        {trainingDaysRoot && (
          <p
            role="alert"
            className="border-b border-error/25 bg-error/10 px-3 py-2 text-sm font-medium text-error sm:px-4"
          >
            {trainingDaysRoot}
          </p>
        )}

        {sortedDays.length > 0 && (
          <DayTabs
            activeDayName={activeDayName}
            onSelectDay={onActiveDayChange}
            onAddDay={handleAddDay}
            acceptsDrop={activeDragType === "library-exercise"}
          />
        )}

        {activeDay ? (
          <div className="bg-neutral-50 px-3 py-3 sm:px-5 sm:py-4">
            <DayHeader
              activeDayName={activeDay.dayName}
              onActiveChange={onActiveDayChange}
            />

            <DayDropZone
              dayName={activeDay.dayName}
              isDragging={isDragging}
              activeDragType={activeDragType}
              isEmpty={activeDay.plannedExercises.length === 0}
            >
              <SortableContext
                items={activeDay.plannedExercises.map((pe) =>
                  rowId(activeDay.dayName, pe.order),
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {activeDay.plannedExercises.length === 0 &&
                    !isAddingExercise && (
                      <ListState
                        kind="empty"
                        variant="dashed-card"
                        message="Día sin ejercicios"
                        hideIcon={true}
                        description="Agregá uno con el buscador o arrastrá desde la biblioteca"
                      />
                    )}
                  {activeDay.plannedExercises.map((pe, i) => {
                    const exErr = byDay
                      .get(activeDay.dayName)
                      ?.exercises.get(pe.order);
                    return (
                      <ExerciseRow
                        key={`${activeDay.dayName}-${pe.exerciseId}-${pe.order}`}
                        dayName={activeDay.dayName}
                        exerciseOrder={pe.order}
                        exerciseId={pe.exerciseId}
                        rowNumber={i + 1}
                        exerciseExecutions={pe.exerciseExecutions}
                        riskStatuses={riskStatuses}
                        error={exErr?.exerciseId ?? exErr?.executions}
                        onEdit={() =>
                          setEditing({
                            dayName: activeDay.dayName,
                            exerciseOrder: pe.order,
                          })
                        }
                      />
                    );
                  })}
                  <AddExerciseInline
                    key={activeDay.dayName}
                    dayName={activeDay.dayName}
                    onOpenChange={(open) =>
                      setAddingForDay(open ? activeDay.dayName : null)
                    }
                  />
                </div>
              </SortableContext>
            </DayDropZone>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 bg-neutral-50 px-4 py-8 text-center sm:px-5 sm:py-10">
            <p className="text-sm text-neutral-500">
              Todavía no agregaste ningún día de entrenamiento
            </p>
            <Button
              intent="primary"
              size="md"
              onClick={handleAddDay}
              disabled={!canAddDay}
            >
              Crear primer día
            </Button>
          </div>
        )}
      </div>

      {editing && (
        <ExerciseEditModal
          dayName={editing.dayName}
          exerciseOrder={editing.exerciseOrder}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

TrainingDaysEditor.displayName = "TrainingDaysEditor";
