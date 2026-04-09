import { z } from "zod";

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

export const registerRiskFlagSchema = z.object({
  name: nameField,
});

export type RegisterRiskFlagSchema = z.infer<typeof registerRiskFlagSchema>;

export const updateRiskFlagSchema = z.object({
  name: nameField,
});

export type UpdateRiskFlagSchema = z.infer<typeof updateRiskFlagSchema>;
