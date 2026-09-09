import { z } from "zod";
import {
  MAX_SLOT_CAPACITY,
  MIN_SLOT_CAPACITY,
  TIME_PATTERN,
} from "../constants";

export const editTimeSlotSchema = z
  .object({
    startTime: z
      .string()
      .min(1, "Ingresá la hora de inicio")
      .regex(TIME_PATTERN, "La hora no es válida"),
    endTime: z
      .string()
      .min(1, "Ingresá la hora de fin")
      .regex(TIME_PATTERN, "La hora no es válida"),
    capacity: z
      .number({ error: "Ingresá la capacidad" })
      .int("Tiene que ser un número entero")
      .min(MIN_SLOT_CAPACITY, "No puede ser negativa")
      .max(MAX_SLOT_CAPACITY, `No puede superar ${MAX_SLOT_CAPACITY}`),
    tag: z.string().optional(),
    scope: z.enum(["cell", "row"]),
  })
  .refine((data) => data.endTime > data.startTime, {
    path: ["endTime"],
    error: "Tiene que ser posterior al inicio",
  });

export type EditTimeSlotSchema = z.infer<typeof editTimeSlotSchema>;
