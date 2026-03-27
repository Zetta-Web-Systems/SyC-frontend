import { useCallback, useState } from "react";
import { DNI_MAX_LENGTH, DNI_MIN_LENGTH } from "../constants";

const DIGIT_REGEX = /^[0-9]$/;

export function useAttendanceDni() {
  const [dni, setDni] = useState("");

  const addDigit = useCallback((digit: string) => {
    if (!DIGIT_REGEX.test(digit)) return;
    setDni((prev) => (prev.length < DNI_MAX_LENGTH ? prev + digit : prev));
  }, []);

  const removeDigit = useCallback(() => {
    setDni((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setDni("");
  }, []);

  const isValid = dni.length >= DNI_MIN_LENGTH && dni.length <= DNI_MAX_LENGTH;
  const canAddDigit = dni.length < DNI_MAX_LENGTH;
  const isEmpty = dni.length === 0;

  return { dni, addDigit, removeDigit, clear, isValid, canAddDigit, isEmpty };
}
