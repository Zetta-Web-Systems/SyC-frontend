export type Slug =
  | "abs"
  | "adductors"
  | "ankles"
  | "biceps"
  | "calves"
  | "chest"
  | "deltoids"
  | "feet"
  | "forearm"
  | "gluteal"
  | "hamstring"
  | "hands"
  | "hair"
  | "head"
  | "knees"
  | "lower-back"
  | "neck"
  | "obliques"
  | "quadriceps"
  | "tibialis"
  | "trapezius"
  | "triceps"
  | "upper-back";

export interface BodyPartPath {
  left?: string[];
  right?: string[];
  common?: string[];
}

export interface BodyPart {
  slug: Slug;
  color: string;
  path: BodyPartPath;
}

export interface BodyPartStyles {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ExtendedBodyPart {
  slug?: Slug;
  color?: string;
  intensity?: number;
  side?: "left" | "right";
  styles?: BodyPartStyles;
}

export type BodySide = "front" | "back";
export type PathSide = "left" | "right" | "common";
