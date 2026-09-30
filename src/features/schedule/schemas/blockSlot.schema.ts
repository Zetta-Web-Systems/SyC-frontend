import { z } from "zod";

export const BLOCK_REASON_MAX_LENGTH = 200;

export const blockSlotSchema = z.object({
  date: z.string().min(1, "Elegí la fecha"),
  reason: z
    .string()
    .max(BLOCK_REASON_MAX_LENGTH, "El motivo es muy largo")
    .optional(),
});

export type BlockSlotSchema = z.infer<typeof blockSlotSchema>;
