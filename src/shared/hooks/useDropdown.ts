import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useDisclosure } from "./useDisclosure";
import { useClickOutside } from "./useClickOutside";

interface UseDropdownOptions {
  initialOpen?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  onClose?: () => void;
}

export interface UseDropdownResult<T extends HTMLElement> {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  containerRef: RefObject<T | null>;
}

export function useDropdown<T extends HTMLElement = HTMLDivElement>(
  options: UseDropdownOptions = {},
): UseDropdownResult<T> {
  const {
    initialOpen = false,
    closeOnEscape = true,
    closeOnClickOutside = true,
    onClose,
  } = options;

  const disclosure = useDisclosure(initialOpen);
  const containerRef = useRef<T>(null);

  const close = useCallback(() => {
    disclosure.close();
    onClose?.();
  }, [disclosure, onClose]);

  useClickOutside(containerRef, close, {
    enabled: disclosure.isOpen && closeOnClickOutside,
  });

  useEffect(() => {
    if (!disclosure.isOpen || !closeOnEscape) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [disclosure.isOpen, closeOnEscape, close]);

  return {
    isOpen: disclosure.isOpen,
    open: disclosure.open,
    close,
    toggle: disclosure.toggle,
    containerRef,
  };
}
