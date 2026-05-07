import { useState, useCallback, useMemo } from "react";
import type { OnChangeFn } from "@tanstack/react-table";
import { useMediaQuery } from "./useMediaQuery";

export type ColumnVisibilityState = Record<string, boolean>;

export interface ColumnVisibilityConfig {
  sm: ColumnVisibilityState;
  md: ColumnVisibilityState;
  lg: ColumnVisibilityState;
}

export interface UseColumnVisibilityOptions {
  config: ColumnVisibilityConfig;
}

export interface UseColumnVisibilityReturn {
  columnVisibility: ColumnVisibilityState;
  setColumnVisibility: OnChangeFn<ColumnVisibilityState>;
  hasUserInteracted: boolean;
}

export function useColumnVisibility({
  config,
}: UseColumnVisibilityOptions): UseColumnVisibilityReturn {
  const isMd = useMediaQuery("(min-width: 1024px)");
  const isLg = useMediaQuery("(min-width: 1280px)");

  const currentBreakpoint = isLg ? "lg" : isMd ? "md" : "sm";

  const [userVisibility, setUserVisibility] =
    useState<ColumnVisibilityState | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const columnVisibility = useMemo(() => {
    if (hasUserInteracted && userVisibility !== null) {
      return userVisibility;
    }
    return config[currentBreakpoint];
  }, [hasUserInteracted, userVisibility, config, currentBreakpoint]);

  const handleSetVisibility: OnChangeFn<ColumnVisibilityState> = useCallback(
    (updater) => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }

      if (typeof updater === "function") {
        const newValue = updater(columnVisibility);
        setUserVisibility(newValue);
      } else {
        setUserVisibility(updater);
      }
    },
    [hasUserInteracted, columnVisibility],
  );

  return {
    columnVisibility,
    setColumnVisibility: handleSetVisibility,
    hasUserInteracted,
  };
}
