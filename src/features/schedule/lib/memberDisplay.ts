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
