import type { Member, MemberSimple } from "@features/members";
import type { Exercise } from "@features/exercise";
import type { CurrentStatus } from "@features/clinicalProfiles";
import type { DayName } from "../constants";

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
  plannedExercises: PlannedExercise[];
}

export interface TrainingPlan {
  id: string;
  startDate: string;
  durationInWeeks: number;
  daysPerWeek: number;
  mobilityBlock: string;
  preparatoryBlock: string;
  aerobicBlock: string;
  member: Member;
  isActive: boolean;
  trainingDays: TrainingDay[];
  isTemplate: boolean;
  templateName?: string | null;
}

export interface TrainingPlanSimple {
  id: string;
  startDate: string;
  endDate: string;
  durationInWeeks: number;
  daysPerWeek: number;
  member: MemberSimple;
  isActive: boolean;
  isTemplate: boolean;
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
  plannedExercises: RegisterPlannedExercise[];
}

interface BaseTrainingPlan {
  startDate: string;
  mobilityBlock: string;
  preparatoryBlock: string;
  aerobicBlock: string;
  isTemplate?: boolean;
  templateName?: string;
}

export interface RegisterTrainingPlan extends BaseTrainingPlan {
  durationInWeeks: number;
  daysPerWeek: number;
  trainingDays: RegisterTrainingDay[];
}

export type UpdateTrainingPlan = Partial<BaseTrainingPlan>;

export type UpdateExerciseExecution = Partial<
  Pick<RegisterExerciseExecution, "sets" | "reps" | "rir">
>;

export interface AddTrainingDay {
  order?: number;
  dayName?: DayName;
}

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
