import type { Slug } from "./bodyHighlighter.types";

export type BodyZone = Exclude<Slug, "hair">;

export type BodyLaterality = "left" | "right";

export interface AffectedGroup {
  label: string;
  zones: BodyZone[];
}
