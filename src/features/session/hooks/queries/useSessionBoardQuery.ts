import { useQuery } from "@tanstack/react-query";
import {
  SESSION_KEYS,
  SESSION_REFETCH_INTERVAL,
  type SessionPosition,
} from "../../constants";
import { getSessionBoard } from "../../services/session.api";
import { mapSessionBoard } from "../../lib/sessionApiMapper";
import { isNotFoundError } from "../../lib/sessionErrors";

export function useSessionBoardQuery(position: SessionPosition) {
  return useQuery({
    queryKey: SESSION_KEYS.board(position),
    queryFn: () => getSessionBoard(position),
    select: mapSessionBoard,
    refetchInterval: SESSION_REFETCH_INTERVAL,
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
  });
}
