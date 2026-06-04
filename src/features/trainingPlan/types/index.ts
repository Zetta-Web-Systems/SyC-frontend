import type { Member, MemberSimple } from "@features/members";
import type { Exercise } from "@features/exercise";
import type { CurrentStatus } from "@features/clinicalProfiles";
import type { DayName, PlanState } from "../constants";

export interface ExerciseExecution {
  id: string;
  weekNumber: number;
  sets: number;
  reps: string;
  rir?: string | null;
}

export interface PlannedExercise {
  id: string;
  order: number;
  exercise: Exercise;
  isYellow: boolean;
  exerciseExecutions: ExerciseExecution[];
  currentStatusAffected: CurrentStatus[];
}

export interface TrainingDay {
  id: string;
  order: number;
  dayName?: DayName | null;
  trainingDayLabel?: string | null;
  plannedExercises: PlannedExercise[];
}

interface BaseTrainingPlan {
  mobilityBlock: string;
  preparatoryBlock: string;
  aerobicBlock: string;
  templateName?: string;
}

export interface TrainingPlan extends BaseTrainingPlan {
  id: string;
  planNumber?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  durationInWeeks: number;
  daysPerWeek: number;
  member?: Member;
  state: PlanState;
  trainingDays: TrainingDay[];
}

export interface TrainingPlanSimple {
  id: string;
  planNumber?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  durationInWeeks: number;
  daysPerWeek: number;
  member?: MemberSimple;
  state: PlanState;
  templateName?: string | null;
}

export interface RegisterExerciseExecution {
  weekNumber: number;
  sets: number;
  reps: string;
  rir?: string;
}

export interface RegisterPlannedExercise {
  exerciseId: string;
  order: number;
  exerciseExecutions: RegisterExerciseExecution[];
}

export interface RegisterTrainingDay {
  order: number;
  dayName?: DayName;
  trainingDayLabel?: string;
  plannedExercises: RegisterPlannedExercise[];
}

export interface RegisterTrainingPlan extends BaseTrainingPlan {
  startDate: string;
  durationInWeeks: number;
  daysPerWeek: number;
  trainingDays: RegisterTrainingDay[];
}

export interface RegisterTrainingPlanTemplate extends Omit<
  BaseTrainingPlan,
  "templateName"
> {
  templateName: string;
  durationInWeeks: number;
  daysPerWeek: number;
  trainingDays: RegisterTrainingDay[];
}

export interface UpdateTrainingPlan extends Partial<BaseTrainingPlan> {
  startDate?: string;
}

export interface ExtendTrainingPlan {
  weeksToExtend: number;
}

export type UpdateExerciseExecution = Partial<
  Pick<RegisterExerciseExecution, "sets" | "reps" | "rir">
>;

export interface AddTrainingDay {
  order?: number;
  dayName?: DayName;
  trainingDayLabel?: string;
}

export type UpdateTrainingDay = Omit<AddTrainingDay, "order">;

export interface ReorderTrainingDays {
  dayIds: string[];
}

export interface AddPlannedExercise {
  exerciseId: string;
  order?: number;
}

export interface ReorderPlannedExercises {
  exerciseIds: string[];
}
