import { z } from "zod";
import { ALL_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { ExerciseLevel } from "../constants";

const bodyZoneEnum = z.enum(ALL_BODY_ZONES as [BodyZone, ...BodyZone[]]);

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const exerciseLevelField = z.enum(
  [ExerciseLevel.ONE, ExerciseLevel.TWO, ExerciseLevel.THREE] as const,
  { error: "El nivel es requerido" },
);

const affectedZonesField = z.array(bodyZoneEnum).optional();

const technicalDescriptionField = z.string().optional();

const linksField = z.array(z.string().url("URL inválida")).optional();

const notesField = z.string().optional();

const exerciseGroupIdField = z
  .string({ error: "El grupo de ejercicios es requerido" })
  .min(1, "El grupo de ejercicios es requerido");

export const registerExerciseSchema = z.object({
  exerciseGroupId: exerciseGroupIdField,
  name: nameField,
  exerciseLevel: exerciseLevelField,
  affectedZones: affectedZonesField,
  technicalDescription: technicalDescriptionField,
  links: linksField,
  notes: notesField,
});

export type RegisterExerciseSchema = z.infer<typeof registerExerciseSchema>;

export const updateExerciseSchema = registerExerciseSchema.partial();

export type UpdateExerciseSchema = z.infer<typeof updateExerciseSchema>;
