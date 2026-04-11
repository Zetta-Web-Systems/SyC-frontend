import { z } from "zod";
import { ALL_BODY_ZONES, type BodyZone } from "../constants";

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
