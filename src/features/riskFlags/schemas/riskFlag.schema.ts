import { z } from "zod";
import { ALL_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";

const bodyZoneEnum = z.enum(ALL_BODY_ZONES as [BodyZone, ...BodyZone[]]);

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const affectedZonesField = z.array(bodyZoneEnum).optional();

const medicalGuidelineField = z.string().optional();

export const registerRiskFlagSchema = z.object({
  name: nameField,
  affectedZones: affectedZonesField,
  medicalGuideline: medicalGuidelineField,
});

export type RegisterRiskFlagSchema = z.infer<typeof registerRiskFlagSchema>;

export const updateRiskFlagSchema = registerRiskFlagSchema.partial();

export type UpdateRiskFlagSchema = z.infer<typeof updateRiskFlagSchema>;
