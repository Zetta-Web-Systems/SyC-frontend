import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@shared/api/apiError";
import {
  ATTENDANCE_ACTION,
  MOOD_MESSAGES,
  REQUEST_STATUS,
  RESET_TIMINGS,
  type AttendanceAction,
  type Mood,
  type RequestStatus,
} from "../../constants";
import type { AttendanceCheckIn } from "../../types";
import { useAttendanceDni } from "./useAttendanceDni";
import { useAttendanceMutation } from "./../mutations/useAttendanceMutation";
import { useAttendanceMoodMutation } from "./../mutations/useAttendanceMoodMutation";

interface FlowState {
  status: RequestStatus | AttendanceAction;
  response: AttendanceCheckIn | null;
  error: string | null;
  moodMessage: string | null;
  profileImageUrl: string | null;
}

const INITIAL_STATE: FlowState = {
  status: REQUEST_STATUS.IDLE,
  response: null,
  error: null,
  moodMessage: null,
  profileImageUrl: null,
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
      moodMessage: null,
      profileImageUrl: null,
    });

    mutation.mutate(dni, {
      onSuccess: (response) => {
        if (response.departureTime != null) {
          setState({
            status: ATTENDANCE_ACTION.EXIT,
            response,
            error: null,
            moodMessage: null,
            profileImageUrl: null,
          });
          startResetTimer("exit");
          return;
        }

        setState({
          status: REQUEST_STATUS.MOOD_SELECTION,
          response,
          error: null,
          moodMessage: null,
          profileImageUrl: null,
        });
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
          moodMessage: null,
          profileImageUrl: null,
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
              status: ATTENDANCE_ACTION.ENTRY,
              response: currentResponse,
              error: null,
              moodMessage: data.message ?? MOOD_MESSAGES[mood],
              profileImageUrl: data.profileImageUrl ?? null,
            });
            startResetTimer("entry");
          },
          onError: () => {
            setState({
              status: ATTENDANCE_ACTION.ENTRY,
              response: currentResponse,
              error: null,
              moodMessage: null,
              profileImageUrl: null,
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
