import { TRAINING_GOAL_LABELS, type Member } from "@features/members";

export function formatMemberMeta(m: Member): string {
  const parts: string[] = [];
  if (m.age) parts.push(`${m.age} años`);
  if (m.trainingGoal) parts.push(TRAINING_GOAL_LABELS[m.trainingGoal]);
  return parts.length > 0 ? parts.join(" · ") : "Sin datos";
}

export function memberInitials(m: Member): string {
  return `${m.name[0] ?? ""}${m.lastname[0] ?? ""}`.toUpperCase();
}

export function memberFullName(m: Member): string {
  return `${m.name} ${m.lastname}`.trim();
}
