import { createStore } from "@shared/lib/createStore";
import type { SessionView } from "../constants";

interface SessionViewState {
  view: SessionView | null;
  setView: (view: SessionView) => void;
}

export const useSessionViewStore = createStore<SessionViewState>(
  "sessionView",
  (set) => ({
    view: null,
    setView: (view) => set({ view }),
  }),
  {
    persist: {
      name: "session-view",
      partialize: (state) => ({ view: state.view }),
    },
  },
);
