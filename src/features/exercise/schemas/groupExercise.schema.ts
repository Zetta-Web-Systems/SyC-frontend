import { z } from "zod";
import { ALL_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";

const bodyZoneEnum = z.enum(ALL_BODY_ZONES as [BodyZone, ...BodyZone[]]);

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const affectedZonesField = z.array(bodyZoneEnum).optional();

export const registerGroupExerciseSchema = z.object({
  name: nameField,
  affectedZones: affectedZonesField,
});

export type RegisterGroupExerciseSchema = z.infer<
  typeof registerGroupExerciseSchema
>;

export const updateGroupExerciseSchema = registerGroupExerciseSchema.partial();

export type UpdateGroupExerciseSchema = z.infer<
  typeof updateGroupExerciseSchema
>;
