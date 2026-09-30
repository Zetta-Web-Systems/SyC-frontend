import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@shared/api/apiError";
import {
  ABSENCE_CHECK_IN_MESSAGE,
  ATTENDANCE_ACTION,
  MOOD_MESSAGES,
  REQUEST_STATUS,
  RESET_TIMINGS,
  type AttendanceAction,
  type Mood,
} from "../../constants";
import type { AttendanceFlowState } from "../../types";
import { useAttendanceDni } from "./useAttendanceDni";
import { useAttendanceMutation } from "./../mutations/useAttendanceMutation";
import { useAttendanceMoodMutation } from "./../mutations/useAttendanceMoodMutation";

const INITIAL_STATE: AttendanceFlowState = {
  status: REQUEST_STATUS.IDLE,
  response: null,
  error: null,
  moodMessage: null,
  feeMessage: null,
  profileImageUrl: null,
};

export function useAttendanceFlow() {
  const [state, setState] = useState<AttendanceFlowState>(INITIAL_STATE);
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
  const moodMutation = useAttendanceMoodMutation();

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
    (status: AttendanceAction) => {
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

    setState({ ...INITIAL_STATE, status: REQUEST_STATUS.LOADING });

    mutation.mutate(dni, {
      onSuccess: (response) => {
        if (response.isAbsent) {
          dniClear();
          setState({
            ...INITIAL_STATE,
            status: REQUEST_STATUS.ERROR,
            error: ABSENCE_CHECK_IN_MESSAGE,
          });
          return;
        }

        if (response.departureTime != null) {
          setState({
            ...INITIAL_STATE,
            status: ATTENDANCE_ACTION.EXIT,
            response,
          });
          startResetTimer("exit");
          return;
        }

        setState({
          ...INITIAL_STATE,
          status: REQUEST_STATUS.MOOD_SELECTION,
          response,
        });
      },
      onError: (err) => {
        const message = getApiErrorMessage(
          err,
          "DNI no reconocido o error de conexión",
        );

        dniClear();

        setState({
          ...INITIAL_STATE,
          status: REQUEST_STATUS.ERROR,
          error: message,
        });

        // TMP-MSG: No auto-dismiss: el error permanece visible hasta que el usuario presione una tecla
      },
    });
  }, [state.status, dni, isValid, dniClear, mutation, startResetTimer]);

  const selectMood = useCallback(
    (mood: Mood) => {
      if (state.status !== REQUEST_STATUS.MOOD_SELECTION) return;
      if (moodMutation.isPending) return;

      const currentResponse = state.response;
      if (!currentResponse) return;

      setState((prev) => ({ ...prev, status: REQUEST_STATUS.MOOD_LOADING }));

      moodMutation.mutate(
        { id: currentResponse.id, mood },
        {
          onSuccess: (data) => {
            setState({
              ...INITIAL_STATE,
              status: ATTENDANCE_ACTION.ENTRY,
              response: currentResponse,
              moodMessage: data.message ?? MOOD_MESSAGES[mood],
              feeMessage: data.feeMessage || null,
              profileImageUrl:
                data.profileImageUrl ?? currentResponse.profileImageUrl ?? null,
            });
            startResetTimer("entry");
          },
          onError: () => {
            setState({
              ...INITIAL_STATE,
              status: ATTENDANCE_ACTION.ENTRY,
              response: currentResponse,
              profileImageUrl: currentResponse.profileImageUrl ?? null,
            });
            startResetTimer("entry");
          },
        },
      );
    },
    [state.status, state.response, moodMutation, startResetTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  return {
    status: state.status,
    response: state.response,
    error: state.error,
    moodMessage: state.moodMessage,
    feeMessage: state.feeMessage,
    profileImageUrl: state.profileImageUrl,

    dni,
    addDigit,
    removeDigit,
    isValid,
    canAddDigit,
    isEmpty,

    submit,
    selectMood,
    reset,
  };
}
