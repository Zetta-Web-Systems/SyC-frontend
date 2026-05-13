import type { BodyZone } from "@shared/types/bodyZone.types";
import type { ExerciseLevel } from "../constants";

export interface Exercise {
  id: string;
  name: string;
  exerciseLevel: ExerciseLevel;
  affectedZones?: BodyZone[];
  exerciseGroup: string;
  technicalDescription?: string | null;
  links?: string[] | null;
  notes?: string | null;
  image?: string;
  isActive: boolean;
}

export interface ExerciseGroup {
  id: string;
  name: string;
  affectedZones?: BodyZone[];
}

export interface RegisterExerciseGroup {
  name: string;
  affectedZones?: BodyZone[];
}

export type UpdateExerciseGroup = Partial<RegisterExerciseGroup>;

export interface RegisterExercise {
  name: string;
  exerciseLevel: ExerciseLevel;
  affectedZones?: BodyZone[];
  technicalDescription?: string;
  links?: string[];
  notes?: string;
  image?: File;
}

export type UpdateExercise = Partial<RegisterExercise> & {
  deleteImage?: boolean;
};

export type { AffectedGroup } from "@shared/types/bodyZone.types";
