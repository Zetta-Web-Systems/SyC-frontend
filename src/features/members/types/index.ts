import type { TrainingGoal } from "../constants";

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
  currentWeight?: number;
  trainingGoal?: TrainingGoal | null;
  image?: string;
}

export interface RegisterMember extends BaseMember {
  dni: string;
  email?: string;
  bornDate?: string;
  currentWeight?: number;
  trainingGoal: TrainingGoal;
  image?: File;
}

export interface UpdateMember extends Partial<RegisterMember> {
  deleteImage?: boolean;
}
