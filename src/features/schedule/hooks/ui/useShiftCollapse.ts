import { useCallback, useState } from "react";
import type { Shift } from "../../constants";

export function useShiftCollapse() {
  const [collapsedShifts, setCollapsedShifts] = useState<ReadonlySet<Shift>>(
    () => new Set(),
  );

  const toggleShift = useCallback((shift: Shift) => {
    setCollapsedShifts((current) => {
      const next = new Set(current);
      if (next.has(shift)) next.delete(shift);
      else next.add(shift);
      return next;
    });
  }, []);

  return { collapsedShifts, toggleShift };
}
