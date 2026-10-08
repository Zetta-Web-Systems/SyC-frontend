import { useEffect, useMemo, useRef } from "react";
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { formatDateToISO } from "@shared/utils/date.utils";
import {
  SESSION_KEYS,
  SESSION_POSITION,
  type SessionPosition,
} from "../../constants";
import { applyDayOverrides } from "../../lib/sessionMemberPlan";
import { isNotFoundError } from "../../lib/sessionErrors";
import { useSessionDayOverridesStore } from "../../stores/sessionDayOverrides.store";
import type { SessionBoard, SessionDayOverride } from "../../types";
import { useSessionBoardQuery } from "./useSessionBoardQuery";

const NO_OVERRIDES: Record<string, SessionDayOverride> = {};

export interface SessionBoardsState {
  boards: Record<SessionPosition, SessionBoard | undefined>;
  queries: Record<SessionPosition, UseQueryResult<SessionBoard>>;
}

function withOverrides(
  board: SessionBoard | undefined,
  overrides: Record<string, SessionDayOverride>,
  error: unknown,
): SessionBoard | undefined {
  if (!board || isNotFoundError(error)) return undefined;
  return { ...board, members: applyDayOverrides(board.members, overrides) };
}

export function useSessionBoards(viewed: SessionPosition): SessionBoardsState {
  const queryClient = useQueryClient();
  const prev = useSessionBoardQuery(
    SESSION_POSITION.PREV,
    viewed === SESSION_POSITION.PREV,
  );
  const current = useSessionBoardQuery(
    SESSION_POSITION.CURRENT,
    viewed === SESSION_POSITION.CURRENT,
  );
  const next = useSessionBoardQuery(
    SESSION_POSITION.NEXT,
    viewed === SESSION_POSITION.NEXT,
  );
  const overridesDate = useSessionDayOverridesStore((s) => s.date);
  const storedOverrides = useSessionDayOverridesStore((s) => s.overrides);
  const overrides =
    overridesDate === formatDateToISO(new Date())
      ? storedOverrides
      : NO_OVERRIDES;

  const nextRepeatsCurrent =
    Boolean(next.data && current.data) &&
    next.data?.turn.timeSlotId === current.data?.turn.timeSlotId;

  const boards = useMemo(
    () => ({
      prev: withOverrides(prev.data, overrides, prev.error),
      current: withOverrides(current.data, overrides, current.error),
      next: nextRepeatsCurrent
        ? undefined
        : withOverrides(next.data, overrides, next.error),
    }),
    [
      prev.data,
      prev.error,
      current.data,
      current.error,
      next.data,
      next.error,
      nextRepeatsCurrent,
      overrides,
    ],
  );

  const lastViewed = useRef(viewed);
  useEffect(() => {
    if (lastViewed.current === viewed) return;
    lastViewed.current = viewed;
    void queryClient.invalidateQueries({
      queryKey: SESSION_KEYS.board(viewed),
      exact: true,
    });
  }, [queryClient, viewed]);

  const currentTurnId = current.isPending
    ? undefined
    : (boards.current?.turn.timeSlotId ?? null);
  const lastCurrentTurnId = useRef(currentTurnId);
  useEffect(() => {
    if (currentTurnId === undefined) return;
    const changed =
      lastCurrentTurnId.current !== undefined &&
      lastCurrentTurnId.current !== currentTurnId;
    lastCurrentTurnId.current = currentTurnId;
    if (!changed) return;
    void queryClient.invalidateQueries({
      queryKey: SESSION_KEYS.board(SESSION_POSITION.PREV),
      exact: true,
    });
    void queryClient.invalidateQueries({
      queryKey: SESSION_KEYS.board(SESSION_POSITION.NEXT),
      exact: true,
    });
  }, [queryClient, currentTurnId]);

  return { boards, queries: { prev, current, next } };
}
