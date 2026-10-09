import { useCallback, useState } from "react";

export function useSlotExpansion() {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const toggle = useCallback((slotId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  }, []);

  const expand = useCallback((slotId: string) => {
    setExpandedIds((current) =>
      current.has(slotId) ? current : new Set(current).add(slotId),
    );
  }, []);

  const expandAll = useCallback((slotIds: string[]) => {
    setExpandedIds(new Set(slotIds));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return { expandedIds, toggle, expand, expandAll, collapseAll };
}
