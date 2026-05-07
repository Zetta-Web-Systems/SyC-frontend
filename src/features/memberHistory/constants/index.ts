export const MEMBER_HISTORY_KEYS = {
  all: ["memberHistory"] as const,
  painHistorical: (memberId: string) =>
    [...MEMBER_HISTORY_KEYS.all, "pain", memberId] as const,
  weightHistorical: (memberId: string) =>
    [...MEMBER_HISTORY_KEYS.all, "weight", memberId] as const,
} as const;

export * from "./painEvolution";
export * from "./weightEvolution";
