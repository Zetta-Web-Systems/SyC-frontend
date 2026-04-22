import { useCallback, useState } from "react";
import type { RiskFlag } from "@features/riskFlags";

export function useCreateRiskFlagFromProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const [newlyCreated, setNewlyCreated] = useState<RiskFlag[]>([]);

  const open = useCallback((searchTerm: string) => {
    setDefaultName(searchTerm);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const registerCreated = useCallback((riskFlag: RiskFlag) => {
    setNewlyCreated((prev) =>
      prev.some((rf) => rf.id === riskFlag.id) ? prev : [...prev, riskFlag],
    );
  }, []);

  return {
    isOpen,
    defaultName,
    open,
    close,
    newlyCreated,
    registerCreated,
  };
}
