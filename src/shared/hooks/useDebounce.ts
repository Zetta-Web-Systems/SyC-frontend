import { useState, useEffect } from "react";

/**
 * Aplica debounce a un valor, retrasando las actualizaciones hasta que hayan pasado (delay)ms
 * desde el último cambio.
 *
 * @param value  - El valor al que se le aplicará debounce.
 * @param delay  - Retraso en milisegundos (por defecto: 300).
 * @returns El valor con debounce aplicado.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
