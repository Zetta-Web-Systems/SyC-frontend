import { z } from "zod";
import { MAX_SLOT_CAPACITY, MIN_SLOT_CAPACITY } from "../constants";

export const editTimeSlotSchema = z.object({
  capacity: z
    .number({ error: "Ingresá la capacidad" })
    .int("Tiene que ser un número entero")
    .min(MIN_SLOT_CAPACITY, "No puede ser negativa")
    .max(MAX_SLOT_CAPACITY, `No puede superar ${MAX_SLOT_CAPACITY}`),
  tagId: z.string().optional(),
});

export type EditTimeSlotSchema = z.infer<typeof editTimeSlotSchema>;
