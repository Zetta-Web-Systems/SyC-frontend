import { createStore } from "@shared/lib/createStore";

const STORAGE_KEY = "sidebar-collapsed";

function getPersistedCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  } catch {
    return false;
  }
}

function persistCollapsed(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    /* Sin localStorage, no agrego error porque no debería JAMAS ocurrir. Pero el try está para los ErrorBoundary */
  }
}

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = createStore<SidebarState>("sidebar", (set) => ({
  collapsed: getPersistedCollapsed(),
  mobileOpen: false,

  toggle: () =>
    set((state) => {
      const next = !state.collapsed;
      persistCollapsed(next);
      return { collapsed: next };
    }),

  expand: () => {
    persistCollapsed(false);
    set({ collapsed: false });
  },

  collapse: () => {
    persistCollapsed(true);
    set({ collapsed: true });
  },

  openMobile: () => set({ mobileOpen: true }),

  closeMobile: () => set({ mobileOpen: false }),
}));
