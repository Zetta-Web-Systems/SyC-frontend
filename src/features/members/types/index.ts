import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type {
  ClinicalProfile,
  ClinicalProfileRegisterSchema,
} from "@features/clinicalProfiles";
import type { FeeSimple, MemberPlanType } from "@features/memberPlans";
import type { TimeSlot } from "@features/schedule";
import type { TrainingGoal } from "../constants";

export interface CurrentStatusLike {
  bodyZone: BodyZone;
  side?: BodyLaterality | null;
  painLevel: number;
}

export interface MemberRiskFlagLike {
  id: string;
  name?: string;
  isActive: boolean;
  notes?: string | null;
  currentStatus: CurrentStatusLike[];
}

interface BaseMember {
  name: string;
  lastname: string;
  phone?: string;
  emergencyPhone?: string;
  address?: string;
}

export interface Member extends BaseMember {
  personId: string;
  id: string;
  dni: string;
  isActive: boolean;
  email?: string;
  bornDate?: string;
  age?: string;
  currentWeight?: number;
  trainingGoal?: TrainingGoal | null;
  image?: string;
  clinicalProfile?: ClinicalProfile;
  memberPlanType?: MemberPlanType | null;
  fee?: FeeSimple;
  timeSlots?: TimeSlot[];
}

export interface MemberSimple {
  id: string;
  name: string;
  lastname: string;
  image?: string | null;
}

export interface RegisterMember extends BaseMember {
  dni: string;
  email?: string;
  bornDate?: string;
  currentWeight?: number;
  trainingGoal?: TrainingGoal;
  memberPlanType?: MemberPlanType;
  image?: File;
  clinicalProfile: ClinicalProfileRegisterSchema;
}

export interface UpdateMember extends Partial<RegisterMember> {
  deleteImage?: boolean;
}
