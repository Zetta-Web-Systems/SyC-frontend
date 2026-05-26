import { z } from "zod";
import { DayName } from "../constants";

const executionSchema = z.object({
  weekNumber: z.number().int().min(1),
  sets: z.number().int().min(1, "Mín. 1 serie"),
  reps: z.string().min(1, "Reps requeridas"),
  rir: z.string().optional(),
});

const plannedExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  order: z.number().int().min(0),
  exerciseExecutions: z.array(executionSchema).min(1),
});

const dayNameField = z.enum(
  [
    DayName.MONDAY,
    DayName.TUESDAY,
    DayName.WEDNESDAY,
    DayName.THURSDAY,
    DayName.FRIDAY,
    DayName.SATURDAY,
    DayName.SUNDAY,
  ] as const,
  { error: "El día de la semana es requerido" },
);

const trainingDaySchema = z.object({
  order: z.number().int().min(0),
  dayName: dayNameField,
  trainingDayLabel: z.string().max(120).optional(),
  plannedExercises: z
    .array(plannedExerciseSchema)
    .min(1, "Cada día debe tener al menos un ejercicio"),
});

const baseSchema = z.object({
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  durationInWeeks: z
    .number({ error: "Duración requerida" })
    .int()
    .min(1, "Mínimo 1 semana")
    .max(52, "Máximo 52 semanas"),
  daysPerWeek: z
    .number({ error: "Frecuencia requerida" })
    .int()
    .min(2, "Mínimo 2 días")
    .max(7, "Máximo 7 días"),
  mobilityBlock: z.string(),
  preparatoryBlock: z.string(),
  aerobicBlock: z.string(),
  trainingDays: z
    .array(trainingDaySchema)
    .min(1, "Agregá al menos un día de entrenamiento")
    .refine((arr) => new Set(arr.map((d) => d.dayName)).size === arr.length, {
      message: "No puede haber dos días con el mismo día de la semana",
    }),
});

export const registerTrainingPlanFormSchema = z.discriminatedUnion("mode", [
  baseSchema.extend({
    mode: z.literal("plan"),
    memberId: z.string().min(1, "Seleccioná un alumno"),
  }),
  baseSchema.extend({
    mode: z.literal("template"),
    templateName: z
      .string()
      .min(1, "El nombre de la plantilla es requerido")
      .max(80, "Máximo 80 caracteres"),
  }),
]);

export type RegisterTrainingPlanFormSchema = z.infer<
  typeof registerTrainingPlanFormSchema
>;

export type RegisterTrainingDayFormSchema = z.infer<typeof trainingDaySchema>;
export type RegisterPlannedExerciseFormSchema = z.infer<
  typeof plannedExerciseSchema
>;
export type RegisterExerciseExecutionFormSchema = z.infer<
  typeof executionSchema
>;
