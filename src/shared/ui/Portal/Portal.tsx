import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export interface PortalProps {
  children: ReactNode;
  container?: Element | DocumentFragment;
}

export function Portal({ children, container }: PortalProps) {
  const target = container ?? globalThis.document?.body;

  if (!target) return null;

  return createPortal(children, target);
}

Portal.displayName = "Portal";
