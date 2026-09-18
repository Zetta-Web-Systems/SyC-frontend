import type { MemberSimple } from "@features/members";

/**
 * Nombre corto para los chips de la grilla, donde el espacio es mínimo.
 * @example formatMemberShortName({ name: "More", lastname: "Gómez" }) => "More G."
 */
export function formatMemberShortName(member: MemberSimple): string {
  const initial = member.lastname.trim().charAt(0);
  return initial ? `${member.name} ${initial.toUpperCase()}.` : member.name;
}

export function formatMemberFullName(member: MemberSimple): string {
  return `${member.name} ${member.lastname}`;
}

/**
 * @example formatMemberInitials({ name: "More", lastname: "Gómez" }) => "MG"
 */
export function formatMemberInitials(member: MemberSimple): string {
  return `${member.name[0] ?? ""}${member.lastname[0] ?? ""}`.toUpperCase();
}
