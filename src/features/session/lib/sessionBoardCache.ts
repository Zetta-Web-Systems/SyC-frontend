import type { Query } from "@tanstack/react-query";
import type { SessionMembersResponseDto } from "../types";

function getBoardData(query: Query): SessionMembersResponseDto | undefined {
  return query.state.data as SessionMembersResponseDto | undefined;
}

export function boardHasTurn(timeSlotId: string) {
  return (query: Query): boolean =>
    getBoardData(query)?.timeSlot.id === timeSlotId;
}

export function boardHasMember(memberId: string) {
  return (query: Query): boolean =>
    getBoardData(query)?.sessionMembers.some((m) => m.member.id === memberId) ??
    false;
}
