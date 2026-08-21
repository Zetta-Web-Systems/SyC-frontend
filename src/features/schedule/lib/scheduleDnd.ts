import type { MemberSimple } from "@features/members";

export const DRAG_TYPE = {
  TURN: "turn",
  UNASSIGNED: "unassigned-member",
} as const;

export const DROP_TYPE = {
  SLOT: "slot",
  UNASSIGNED: "unassigned-panel",
  REJECT: "reject",
} as const;

export interface TurnDragData {
  type: typeof DRAG_TYPE.TURN;
  turnId: string;
  slotId: string;
  member: MemberSimple;
  isHeld: boolean;
}

export interface UnassignedDragData {
  type: typeof DRAG_TYPE.UNASSIGNED;
  member: MemberSimple;
}

export type ActiveDragData = TurnDragData | UnassignedDragData;

interface BaseDropData {
  label: string;
}

export interface SlotDropData extends BaseDropData {
  type: typeof DROP_TYPE.SLOT;
  slotId: string;
  date: string;
}

export interface UnassignedDropData extends BaseDropData {
  type: typeof DROP_TYPE.UNASSIGNED;
}

export interface RejectDropData extends BaseDropData {
  type: typeof DROP_TYPE.REJECT;
  reason: string;
}

export type DropData = SlotDropData | UnassignedDropData | RejectDropData;

export function turnDragId(turnId: string): string {
  return `turn:${turnId}`;
}

export function unassignedDragId(memberId: string): string {
  return `unassigned-member:${memberId}`;
}

export function slotDropId(slotId: string, date: string): string {
  return `slot:${slotId}:${date}`;
}

export function rejectDropId(cellId: string): string {
  return `reject:${cellId}`;
}

export const UNASSIGNED_DROP_ID = "unassigned-panel";
