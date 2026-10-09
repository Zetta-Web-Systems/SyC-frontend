import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_KEYS, type SessionPosition } from "../../constants";

export function useRefreshSession(position: SessionPosition) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: SESSION_KEYS.board(position),
      exact: true,
    });
    void queryClient.invalidateQueries({ queryKey: SESSION_KEYS.planDays() });
  }, [queryClient, position]);
}
