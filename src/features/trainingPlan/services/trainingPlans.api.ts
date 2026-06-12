import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type {
  AddPlannedExercise,
  AddTrainingDay,
  ExtendTrainingPlan,
  PlannedExerciseTrafficLight,
  RegisterTrainingPlan,
  RegisterTrainingPlanTemplate,
  ReorderPlannedExercises,
  ReorderTrainingDays,
  TrafficLightRequest,
  TrainingPlan,
  TrainingPlanSimple,
  UpdateExerciseExecution,
  UpdateTrainingDay,
  UpdateTrainingPlan,
} from "../types";

export async function getTrainingPlansPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<TrainingPlanSimple>>(
    "/training-plans/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function getTrainingPlanById(id: string) {
  const { data } = await api.get<TrainingPlan>(`/training-plans/${id}`);
  return data;
}

export async function registerTrainingPlan(
  memberId: string,
  dto: RegisterTrainingPlan,
) {
  const { data } = await api.post<TrainingPlan>(
    `/training-plans/register/${memberId}`,
    dto,
  );
  return data;
}

export async function registerTrainingPlanTemplate(
  dto: RegisterTrainingPlanTemplate,
) {
  const { data } = await api.post<TrainingPlan>(
    `/training-plans/template/register`,
    dto,
  );
  return data;
}

export async function updateTrainingPlan(id: string, dto: UpdateTrainingPlan) {
  const { data } = await api.patch<TrainingPlan>(`/training-plans/${id}`, dto);
  return data;
}

export async function deleteTrainingPlan(id: string) {
  await api.delete(`/training-plans/${id}`);
}

export async function extendTrainingPlan(id: string, dto: ExtendTrainingPlan) {
  const { data } = await api.patch<TrainingPlan>(
    `/training-plans/extend/${id}`,
    dto,
  );
  return data;
}

export async function addTrainingDay(
  trainingPlanId: string,
  dto: AddTrainingDay,
) {
  const { data } = await api.post<TrainingPlan>(
    `/training-plans/${trainingPlanId}/training-days/add`,
    dto,
  );
  return data;
}

export async function updateTrainingDay(
  trainingDayId: string,
  dto: UpdateTrainingDay,
) {
  const { data } = await api.patch<TrainingPlan>(
    `/training-plans/training-days/${trainingDayId}`,
    dto,
  );
  return data;
}

export async function deleteTrainingDay(trainingDayId: string) {
  await api.delete(`/training-plans/training-days/${trainingDayId}`);
}

export async function reorderTrainingDays(
  trainingPlanId: string,
  dto: ReorderTrainingDays,
) {
  await api.patch(
    `/training-plans/${trainingPlanId}/training-days/reorder`,
    dto,
  );
}

export async function addPlannedExercise(
  trainingDayId: string,
  dto: AddPlannedExercise,
) {
  const { data } = await api.post<TrainingPlan>(
    `/training-plans/training-days/${trainingDayId}/planned-exercises/add`,
    dto,
  );
  return data;
}

export async function reorderPlannedExercises(
  trainingDayId: string,
  dto: ReorderPlannedExercises,
) {
  await api.patch(
    `/training-plans/training-days/${trainingDayId}/planned-exercises/reorder`,
    dto,
  );
}

export async function deletePlannedExercise(plannedExerciseId: string) {
  await api.delete(
    `/training-plans/training-days/planned-exercises/${plannedExerciseId}`,
  );
}

export async function getPlannedExerciseTrafficLight(dto: TrafficLightRequest) {
  const { data } = await api.get<PlannedExerciseTrafficLight>(
    "/training-plans/training-days/planned-exercises/traffic-light",
    { params: dto },
  );
  return data;
}

export async function updateExerciseExecution(
  exerciseExecutionId: string,
  dto: UpdateExerciseExecution,
) {
  await api.patch(
    `/training-plans/training-days/planned-exercises/exercise-executions/${exerciseExecutionId}`,
    dto,
  );
}
