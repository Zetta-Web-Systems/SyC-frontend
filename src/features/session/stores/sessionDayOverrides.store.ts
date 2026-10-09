import { createStore } from "@shared/lib/createStore";
import { formatDateToISO } from "@shared/utils/date.utils";
import type { SessionDayOverride } from "../types";

interface SessionDayOverridesState {
  date: string;
  overrides: Record<string, SessionDayOverride>;
  setOverride: (memberId: string, override: SessionDayOverride) => void;
}

export const useSessionDayOverridesStore =
  createStore<SessionDayOverridesState>(
    "sessionDayOverrides",
    (set) => ({
      date: formatDateToISO(new Date()),
      overrides: {},
      setOverride: (memberId, override) =>
        set((state) => {
          const today = formatDateToISO(new Date());
          const overrides = state.date === today ? state.overrides : {};
          return {
            date: today,
            overrides: { ...overrides, [memberId]: override },
          };
        }),
    }),
    {
      persist: {
        name: "session-day-overrides",
        partialize: (state) => ({
          date: state.date,
          overrides: state.overrides,
        }),
      },
    },
  );
