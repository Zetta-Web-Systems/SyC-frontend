import { createContext, useContext } from "react";

export interface WizardContextValue {
  current: string;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  back: () => void;
  goTo: (name: string) => void;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("Wizard subcomponents must be used within <WizardModal>");
  }
  return ctx;
}
