import { useCallback, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type {
  RegisterPlannedExerciseFormSchema,
  RegisterTrainingDayFormSchema,
  RegisterTrainingPlanFormSchema,
} from "../../schemas/registerTrainingPlan.schema";
import { DayName } from "../../constants";
import {
  DAY_ORDER,
  compareByDayOrder,
  isWeekFull,
  nextFreeDay,
  sortDays,
} from "../../lib/dayOrder";
import {
  appendDay,
  appendExerciseToDay,
  duplicateDayInto,
  duplicateExerciseInDay,
  recomputeDayOrders,
  removeDayByName,
  removeExerciseFromDay,
  renameDay,
  reorderExercisesInDay,
  replaceExerciseInDay,
  setDayLabel,
} from "../../lib/trainingDayOperations";

type Form = ReturnType<typeof useFormContext<RegisterTrainingPlanFormSchema>>;

interface AddExerciseInput {
  exercise: { id: string };
}

export function useTrainingPlanFormHelpers() {
  const form = useFormContext<RegisterTrainingPlanFormSchema>() as Form;

  const trainingDays = useWatch({
    control: form.control,
    name: "trainingDays",
  });

  const sortedDays = useMemo(
    () => sortDays(trainingDays ?? []),
    [trainingDays],
  );
  const usedDayNames = useMemo(
    () => (trainingDays ?? []).map((d) => d.dayName),
    [trainingDays],
  );
  const canAddDay = !isWeekFull(usedDayNames);

  const setDays = useCallback(
    (days: RegisterTrainingDayFormSchema[]) => {
      form.setValue("trainingDays", recomputeDayOrders(days), {
        shouldDirty: true,
      });
      if (form.formState.submitCount > 0) {
        void form.trigger();
      }
    },
    [form],
  );

  const addDay = useCallback((): DayName | undefined => {
    const current = form.getValues("trainingDays");
    const free = nextFreeDay(current.map((d) => d.dayName));
    if (!free) return undefined;
    setDays(appendDay(current, free));
    return free;
  }, [form, setDays]);

  const removeDay = useCallback(
    (dayName: DayName) => {
      const current = form.getValues("trainingDays");
      setDays(removeDayByName(current, dayName));
    },
    [form, setDays],
  );

  const changeDayName = useCallback(
    (from: DayName, to: DayName) => {
      const current = form.getValues("trainingDays");
      setDays(renameDay(current, from, to));
    },
    [form, setDays],
  );

  const duplicateDay = useCallback(
    (sourceDayName: DayName): DayName | undefined => {
      const current = form.getValues("trainingDays");
      const free = nextFreeDay(current.map((d) => d.dayName));
      if (!free) return undefined;
      const duration = form.getValues("durationInWeeks");
      setDays(duplicateDayInto(current, sourceDayName, free, duration));
      return free;
    },
    [form, setDays],
  );

  const updateDayLabel = useCallback(
    (dayName: DayName, label: string) => {
      const current = form.getValues("trainingDays");
      setDays(setDayLabel(current, dayName, label));
    },
    [form, setDays],
  );

  const addExercise = useCallback(
    (dayName: DayName, input: AddExerciseInput) => {
      const current = form.getValues("trainingDays");
      const duration = form.getValues("durationInWeeks");
      setDays(
        appendExerciseToDay(current, dayName, input.exercise.id, duration),
      );
    },
    [form, setDays],
  );

  const updateExercise = useCallback(
    (
      dayName: DayName,
      exerciseOrder: number,
      next: RegisterPlannedExerciseFormSchema,
    ) => {
      const current = form.getValues("trainingDays");
      setDays(replaceExerciseInDay(current, dayName, exerciseOrder, next));
    },
    [form, setDays],
  );

  const removeExercise = useCallback(
    (dayName: DayName, exerciseOrder: number) => {
      const current = form.getValues("trainingDays");
      setDays(removeExerciseFromDay(current, dayName, exerciseOrder));
    },
    [form, setDays],
  );

  const reorderExercise = useCallback(
    (dayName: DayName, fromOrder: number, toOrder: number) => {
      const current = form.getValues("trainingDays");
      setDays(reorderExercisesInDay(current, dayName, fromOrder, toOrder));
    },
    [form, setDays],
  );

  const duplicateExercise = useCallback(
    (dayName: DayName, exerciseOrder: number) => {
      const current = form.getValues("trainingDays");
      setDays(duplicateExerciseInDay(current, dayName, exerciseOrder));
    },
    [form, setDays],
  );

  return {
    form,
    sortedDays,
    usedDayNames,
    canAddDay,
    addDay,
    removeDay,
    changeDayName,
    duplicateDay,
    updateDayLabel,
    addExercise,
    updateExercise,
    removeExercise,
    duplicateExercise,
    reorderExercise,
    DAY_ORDER,
    compareByDayOrder,
  };
}
