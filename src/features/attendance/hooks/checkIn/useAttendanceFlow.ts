import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@shared/api/apiError";
import {
  ATTENDANCE_ACTION,
  REQUEST_STATUS,
  RESET_TIMINGS,
  type AttendanceAction,
  type RequestStatus,
} from "../../constants";
import type { AttendanceCheckIn } from "../../types";
import { useAttendanceDni } from "./useAttendanceDni";
import { useAttendanceMutation } from "./../mutations/useAttendanceMutation";

interface FlowState {
  status: RequestStatus | AttendanceAction;
  response: AttendanceCheckIn | null;
  error: string | null;
}

const INITIAL_STATE: FlowState = {
  status: REQUEST_STATUS.IDLE,
  response: null,
  error: null,
};

export function useAttendanceFlow() {
  const [state, setState] = useState<FlowState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    dni,
    addDigit: dniAddDigit,
    removeDigit: dniRemoveDigit,
    clear: dniClear,
    isValid,
    canAddDigit,
    isEmpty,
  } = useAttendanceDni();
  const mutation = useAttendanceMutation();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState(INITIAL_STATE);
    dniClear();
  }, [clearTimer, dniClear]);

  const startResetTimer = useCallback(
    (status: "entry" | "exit") => {
      clearTimer();
      timerRef.current = setTimeout(reset, RESET_TIMINGS[status]);
    },
    [clearTimer, reset],
  );

  const dismissError = useCallback(() => {
    clearTimer();
    setState(INITIAL_STATE);
  }, [clearTimer]);

  const addDigit = useCallback(
    (digit: string) => {
      if (state.status === REQUEST_STATUS.ERROR) {
        dismissError();
      }
      dniAddDigit(digit);
    },
    [state.status, dismissError, dniAddDigit],
  );

  const removeDigit = useCallback(() => {
    if (state.status === REQUEST_STATUS.ERROR) {
      dismissError();
    }
    dniRemoveDigit();
  }, [state.status, dismissError, dniRemoveDigit]);

  const submit = useCallback(() => {
    if (state.status !== REQUEST_STATUS.IDLE) return;
    if (!isValid) return;
    if (mutation.isPending) return;

    setState({
      status: REQUEST_STATUS.LOADING,
      response: null,
      error: null,
    });

    mutation.mutate(dni, {
      onSuccess: (response) => {
        const resultStatus =
          response.departureTime != null
            ? ATTENDANCE_ACTION.EXIT
            : ATTENDANCE_ACTION.ENTRY;

        setState({ status: resultStatus, response, error: null });
        startResetTimer(resultStatus);
      },
      onError: (err) => {
        const message = getApiErrorMessage(
          err,
          "DNI no reconocido o error de conexión",
        );

        dniClear();

        setState({
          status: REQUEST_STATUS.ERROR,
          response: null,
          error: message,
        });

        // TMP-MSG: No auto-dismiss: el error permanece visible hasta que el usuario presione una tecla
      },
    });
  }, [state.status, dni, isValid, dniClear, mutation, startResetTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  return {
    status: state.status,
    response: state.response,
    error: state.error,

    dni,
    addDigit,
    removeDigit,
    isValid,
    canAddDigit,
    isEmpty,

    submit,
    reset,
  };
}
