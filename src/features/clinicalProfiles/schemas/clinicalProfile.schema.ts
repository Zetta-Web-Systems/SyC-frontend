import { z } from "zod";
import { ALL_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";
import {
  GENERAL_OBSERVATIONS_MAX_LENGTH,
  MOVEMENT_PHASE_MAX_LENGTH,
  NOTES_MAX_LENGTH,
  PAIN_LEVEL_MAX,
  PAIN_LEVEL_UPDATE_MIN,
} from "../constants";

const bodyZoneEnum = z.enum(ALL_BODY_ZONES as [BodyZone, ...BodyZone[]]);
const sideEnum = z.enum(["left", "right"]);

export const currentStatusCreateSchema = z.object({
  painLevel: z
    .number({ error: "El nivel de dolor es requerido" })
    .int()
    .min(PAIN_LEVEL_UPDATE_MIN, `Mínimo ${PAIN_LEVEL_UPDATE_MIN}`)
    .max(PAIN_LEVEL_MAX, `Máximo ${PAIN_LEVEL_MAX}`),
  movementPhase: z.string().max(MOVEMENT_PHASE_MAX_LENGTH).optional(),
  bodyZone: bodyZoneEnum,
  side: sideEnum,
});

export const currentStatusUpdateSchema = z.object({
  painLevel: z
    .number()
    .int()
    .min(PAIN_LEVEL_UPDATE_MIN, `Mínimo ${PAIN_LEVEL_UPDATE_MIN}`)
    .max(PAIN_LEVEL_MAX, `Máximo ${PAIN_LEVEL_MAX}`)
    .optional(),
  movementPhase: z.string().max(MOVEMENT_PHASE_MAX_LENGTH).optional(),
});

export const memberRiskFlagRegisterSchema = z.object({
  riskFlagId: z.string().min(1, "Seleccioná un risk flag"),
  notes: z.string().max(NOTES_MAX_LENGTH).optional(),
  currentStatus: z
    .array(currentStatusCreateSchema)
    .min(1, "Agregá al menos un estado"),
});

export const memberRiskFlagUpdateSchema = z.object({
  notes: z.string().max(NOTES_MAX_LENGTH).nullish(),
});

export const clinicalProfileRegisterSchema = z.object({
  generalObservations: z
    .string()
    .max(GENERAL_OBSERVATIONS_MAX_LENGTH)
    .optional(),
  memberRiskFlags: z.array(memberRiskFlagRegisterSchema).optional(),
});

export const clinicalProfileUpdateSchema = z.object({
  generalObservations: z
    .string()
    .max(GENERAL_OBSERVATIONS_MAX_LENGTH)
    .nullish(),
});

const currentStatusFormSchema = z.object({
  id: z.string().optional(),
  painLevel: z
    .number({ error: "El nivel de dolor es requerido" })
    .int()
    .min(PAIN_LEVEL_UPDATE_MIN, `Mínimo ${PAIN_LEVEL_UPDATE_MIN}`)
    .max(PAIN_LEVEL_MAX, `Máximo ${PAIN_LEVEL_MAX}`),
  movementPhase: z.string().max(MOVEMENT_PHASE_MAX_LENGTH).optional(),
  bodyZone: bodyZoneEnum,
  side: sideEnum,
});

const memberRiskFlagFormSchema = z.object({
  id: z.string().optional(),
  riskFlagId: z.string().min(1, "Seleccioná un risk flag"),
  notes: z.string().max(NOTES_MAX_LENGTH).optional(),
  isActive: z.boolean(),
  currentStatus: z
    .array(currentStatusFormSchema)
    .min(1, "Agregá al menos un estado"),
});

export const clinicalProfileFormSchema = z.object({
  generalObservations: z
    .string()
    .max(GENERAL_OBSERVATIONS_MAX_LENGTH)
    .optional(),
  memberRiskFlags: z.array(memberRiskFlagFormSchema),
});

export type ClinicalProfileRegisterSchema = z.infer<
  typeof clinicalProfileRegisterSchema
>;
export type MemberRiskFlagRegisterSchema = z.infer<
  typeof memberRiskFlagRegisterSchema
>;
export type CurrentStatusCreateSchema = z.infer<
  typeof currentStatusCreateSchema
>;

export type ClinicalProfileUpdateSchema = z.infer<
  typeof clinicalProfileUpdateSchema
>;
export type MemberRiskFlagUpdateSchema = z.infer<
  typeof memberRiskFlagUpdateSchema
>;
export type CurrentStatusUpdateSchema = z.infer<
  typeof currentStatusUpdateSchema
>;

export type ClinicalProfileFormSchema = z.infer<
  typeof clinicalProfileFormSchema
>;
export type MemberRiskFlagFormSchema = z.infer<typeof memberRiskFlagFormSchema>;
export type CurrentStatusFormSchema = z.infer<typeof currentStatusFormSchema>;
