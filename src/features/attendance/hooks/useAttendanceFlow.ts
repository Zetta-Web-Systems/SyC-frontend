import { useCallback, useRef, useState } from "react";
import { getApiErrorMessage } from "@shared/api/apiError";
import { ATTENDANCE_STATUS } from "../types";
import type { AttendanceResponse, AttendanceStatus } from "../types";
import { RESET_TIMINGS } from "../constants";
import { useAttendanceDni } from "./useAttendanceDni";
import { useAttendanceMutation } from "./mutations/useAttendanceMutation";

interface FlowState {
  status: AttendanceStatus;
  response: AttendanceResponse | null;
  error: string | null;
}

const INITIAL_STATE: FlowState = {
  status: ATTENDANCE_STATUS.IDLE,
  response: null,
  error: null,
};

export function useAttendanceFlow() {
  const [state, setState] = useState<FlowState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dniState = useAttendanceDni();
  const mutation = useAttendanceMutation();

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState(INITIAL_STATE);
    dniState.clear();
  }, [dniState]);

  const startResetTimer = useCallback(
    (status: "entry" | "exit" | "error") => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(reset, RESET_TIMINGS[status]);
    },
    [reset],
  );

  const dismissError = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState(INITIAL_STATE);
    dniState.clear();
  }, [dniState]);

  const addDigit = useCallback(
    (digit: string) => {
      if (state.status === ATTENDANCE_STATUS.ERROR) {
        dismissError();
      }
      dniState.addDigit(digit);
    },
    [state.status, dismissError, dniState],
  );

  const removeDigit = useCallback(() => {
    if (state.status === ATTENDANCE_STATUS.ERROR) {
      dismissError();
    }
    dniState.removeDigit();
  }, [state.status, dismissError, dniState]);

  const submit = useCallback(() => {
    if (state.status !== ATTENDANCE_STATUS.IDLE) return;
    if (!dniState.isValid) return;
    if (mutation.isPending) return;

    setState({
      status: ATTENDANCE_STATUS.LOADING,
      response: null,
      error: null,
    });

    mutation.mutate(dniState.dni, {
      onSuccess: (response) => {
        const resultStatus =
          response.departureTime !== null
            ? ATTENDANCE_STATUS.EXIT
            : ATTENDANCE_STATUS.ENTRY;

        setState({ status: resultStatus, response, error: null });
        startResetTimer(resultStatus);
      },
      onError: (err) => {
        const message = getApiErrorMessage(
          err,
          "DNI no reconocido o error de conexión",
        );
        setState({
          status: ATTENDANCE_STATUS.ERROR,
          response: null,
          error: message,
        });
        startResetTimer(ATTENDANCE_STATUS.ERROR);
      },
    });
  }, [state.status, dniState.isValid, dniState.dni, mutation, startResetTimer]);

  return {
    status: state.status,
    response: state.response,
    error: state.error,

    dni: dniState.dni,
    addDigit,
    removeDigit,
    isValid: dniState.isValid,
    canAddDigit: dniState.canAddDigit,
    isEmpty: dniState.isEmpty,

    submit,
    reset,
  };
}
