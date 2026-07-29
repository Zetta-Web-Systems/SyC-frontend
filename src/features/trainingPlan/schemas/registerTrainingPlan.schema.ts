import { z } from "zod";
import { formatDateToISO } from "@shared/utils/date.utils";
import { DayName } from "../constants";

const executionSchema = z.object({
  id: z.string().optional(),
  weekNumber: z.number().int().min(1),
  sets: z.number().int().min(1, "Mín. 1 serie"),
  reps: z.string().min(1, "Reps requeridas"),
  rir: z.string().optional(),
});

const plannedExerciseSchema = z.object({
  id: z.string().optional(),
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
  id: z.string().optional(),
  order: z.number().int().min(0),
  dayName: dayNameField,
  trainingDayLabel: z.string().max(120).optional(),
  plannedExercises: z
    .array(plannedExerciseSchema)
    .min(1, "Cada día debe tener al menos un ejercicio"),
});

const baseShape = {
  instructorId: z.string().optional(),
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
  mobilityBlock: z.string().min(1, "El bloque de movilidad es obligatorio"),
  preparatoryBlock: z.string().min(1, "El bloque preparatorio es obligatorio"),
  aerobicBlock: z.string().min(1, "El bloque aeróbico es obligatorio"),
  trainingDays: z
    .array(trainingDaySchema)
    .min(1, "Agregá al menos un día de entrenamiento")
    .max(7, "Máximo 7 días")
    .refine((arr) => new Set(arr.map((d) => d.dayName)).size === arr.length, {
      message: "No puede haber dos días con el mismo día de la semana",
    }),
};

const planBranch = z.object({
  mode: z.literal("plan"),
  memberId: z.string().min(1, "Seleccioná un alumno o guardalo como plantilla"),
  ...baseShape,
});

const templateBranch = z.object({
  mode: z.literal("template"),
  templateName: z.string().max(80, "Máximo 80 caracteres").optional(),
  ...baseShape,
});

type RawTrainingPlanFormValues =
  | z.infer<typeof planBranch>
  | z.infer<typeof templateBranch>;

function attachCrossFieldIssues(
  data: RawTrainingPlanFormValues,
  ctx: z.RefinementCtx,
  allowPastStartDate: boolean,
) {
  if (
    !allowPastStartDate &&
    data.mode === "plan" &&
    data.startDate &&
    data.startDate < formatDateToISO(new Date())
  ) {
    ctx.addIssue({
      code: "custom",
      message: "La fecha debe ser hoy o futura",
      path: ["startDate"],
    });
  }

  if (data.trainingDays.length !== data.daysPerWeek) {
    ctx.addIssue({
      code: "custom",
      message: `Faltan días por configurar (${data.trainingDays.length}/${data.daysPerWeek})`,
      path: ["trainingDays"],
    });
  }

  data.trainingDays.forEach((day, dayIndex) => {
    const seenExerciseIds = new Map<string, number>();
    day.plannedExercises.forEach((pe, peIndex) => {
      if (pe.exerciseId) {
        if (seenExerciseIds.has(pe.exerciseId)) {
          ctx.addIssue({
            code: "custom",
            message: "Ejercicio repetido en este día",
            path: [
              "trainingDays",
              dayIndex,
              "plannedExercises",
              peIndex,
              "exerciseId",
            ],
          });
        } else {
          seenExerciseIds.set(pe.exerciseId, peIndex);
        }
      }

      const execs = pe.exerciseExecutions;
      if (execs.length !== data.durationInWeeks) {
        ctx.addIssue({
          code: "custom",
          message: `Las semanas deben coincidir con la duración de la planificación (${data.durationInWeeks})`,
          path: [
            "trainingDays",
            dayIndex,
            "plannedExercises",
            peIndex,
            "exerciseExecutions",
          ],
        });
        return;
      }

      const seenWeeks = new Set<number>();
      execs.forEach((exec, execIndex) => {
        if (exec.weekNumber > data.durationInWeeks) {
          ctx.addIssue({
            code: "custom",
            message: `La semana no puede ser mayor a ${data.durationInWeeks}`,
            path: [
              "trainingDays",
              dayIndex,
              "plannedExercises",
              peIndex,
              "exerciseExecutions",
              execIndex,
              "weekNumber",
            ],
          });
        }
        if (seenWeeks.has(exec.weekNumber)) {
          ctx.addIssue({
            code: "custom",
            message: "Número de semana duplicado",
            path: [
              "trainingDays",
              dayIndex,
              "plannedExercises",
              peIndex,
              "exerciseExecutions",
              execIndex,
              "weekNumber",
            ],
          });
        }
        seenWeeks.add(exec.weekNumber);
      });
    });
  });
}

export function createTrainingPlanFormSchema(allowPastStartDate = false) {
  return z
    .discriminatedUnion("mode", [planBranch, templateBranch])
    .superRefine((data, ctx) =>
      attachCrossFieldIssues(data, ctx, allowPastStartDate),
    );
}

export const registerTrainingPlanFormSchema =
  createTrainingPlanFormSchema(false);

export const editTrainingPlanFormSchema = createTrainingPlanFormSchema(true);

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
