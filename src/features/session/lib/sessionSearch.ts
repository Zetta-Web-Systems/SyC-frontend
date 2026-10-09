import type { SessionMember, SessionSearchGroup } from "../types";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function matchesMemberName(
  { member }: SessionMember,
  query: string,
): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;

  const nameWords = normalize(`${member.name} ${member.lastname}`).split(/\s+/);
  return words.every((word) =>
    nameWords.some((nameWord) => nameWord.startsWith(word)),
  );
}

export function searchSessionMembers(
  groups: SessionSearchGroup[],
  query: string,
): SessionSearchGroup[] {
  return groups
    .map((group) => ({
      ...group,
      members: group.members.filter((m) => matchesMemberName(m, query)),
    }))
    .filter((group) => group.members.length > 0);
}
