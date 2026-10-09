import { z } from "zod";
import {
  MAX_SLOT_CAPACITY,
  MIN_SLOT_CAPACITY,
  SCHEDULE_DAY,
  TIME_PATTERN,
} from "../constants";

export const createTimeSlotSchema = z
  .object({
    startTime: z
      .string()
      .min(1, "Ingresá la hora de inicio")
      .regex(TIME_PATTERN, "La hora no es válida"),
    capacity: z
      .number({ error: "Ingresá la capacidad" })
      .int("Tiene que ser un número entero")
      .min(MIN_SLOT_CAPACITY, "No puede ser negativa")
      .max(MAX_SLOT_CAPACITY, `No puede superar ${MAX_SLOT_CAPACITY}`),
    days: z.array(z.enum(SCHEDULE_DAY)).min(1, "Elegí al menos un día"),
    hasCustomEnd: z.boolean(),
    endTime: z.string(),
  })
  .refine((data) => !data.hasCustomEnd || TIME_PATTERN.test(data.endTime), {
    path: ["endTime"],
    error: "Ingresá la hora de fin",
  })
  .refine((data) => !data.hasCustomEnd || data.endTime > data.startTime, {
    path: ["endTime"],
    error: "Tiene que ser posterior al inicio",
  });

export type CreateTimeSlotSchema = z.infer<typeof createTimeSlotSchema>;
