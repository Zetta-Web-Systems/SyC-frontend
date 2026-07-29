import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";

type OBField = keyof Pick<
  RegisterTrainingPlanFormSchema,
  "mobilityBlock" | "preparatoryBlock" | "aerobicBlock"
>;

export const OB_BLOCK_TONE = {
  MOBILITY: "mobility",
  PREPARATORY: "preparatory",
  AEROBIC: "aerobic",
} as const;

export type OBBlockTone = (typeof OB_BLOCK_TONE)[keyof typeof OB_BLOCK_TONE];

export interface TrainingPlanOBEntry {
  key: OBField;
  label: string;
  badge: string;
  tone: OBBlockTone;
  placeholder: string;
}

export const TRAINING_PLAN_OB: readonly TrainingPlanOBEntry[] = [
  {
    key: "mobilityBlock",
    label: "Movilidad",
    badge: "1° bloque",
    tone: OB_BLOCK_TONE.MOBILITY,
    placeholder: "Ingresa el bloque de movilidad",
  },
  {
    key: "preparatoryBlock",
    label: "Preparatorio",
    badge: "2° bloque",
    tone: OB_BLOCK_TONE.PREPARATORY,
    placeholder: "Ingresa el bloque preparatorio",
  },
  {
    key: "aerobicBlock",
    label: "Aeróbico",
    badge: "4° bloque",
    tone: OB_BLOCK_TONE.AEROBIC,
    placeholder: "Ingresa el bloque aeróbico",
  },
];
