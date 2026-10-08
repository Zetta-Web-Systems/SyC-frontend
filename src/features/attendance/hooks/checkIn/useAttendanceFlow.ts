import { useCallback, useEffect, useRef, useState } from "react";
import type { FeeSimple } from "@features/memberPlans";
import {
  ATTENDANCE_ACTION,
  CHECK_IN_TIMEOUTS,
  MOOD_SECONDS,
  REQUEST_STATUS,
  type AttendanceAction,
  type Mood,
} from "../../constants";
import type {
  AttendanceCheckIn,
  AttendanceFlowState,
  CheckInTimer,
} from "../../types";
import {
  getCheckInErrorMessage,
  getFeeStatus,
  getResultSeconds,
  isMissingFeeError,
  isRepeatCheckIn,
  resolveCheckInFee,
} from "../../utils/checkIn.utils";
import { useAttendanceDni } from "./useAttendanceDni";
import { useAttendanceMutation } from "./../mutations/useAttendanceMutation";
import { useAttendanceMoodMutation } from "./../mutations/useAttendanceMoodMutation";

const INITIAL_STATE: AttendanceFlowState = {
  status: REQUEST_STATUS.IDLE,
  response: null,
  error: null,
  fee: undefined,
  timer: null,
};

export function useAttendanceFlow() {
  const [state, setState] = useState<AttendanceFlowState>(INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    dni,
    addDigit: dniAddDigit,
    removeDigit: dniRemoveDigit,
    replace: dniReplace,
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

  const startTimer = useCallback(
    (seconds: number, onDone: () => void): CheckInTimer => {
      clearTimer();
      timerRef.current = setTimeout(onDone, seconds * 1000);
      return { seconds, endsAt: Date.now() + seconds * 1000 };
    },
    [clearTimer],
  );

  const showResult = useCallback(
    (
      status: AttendanceAction,
      response: AttendanceCheckIn,
      fee?: FeeSimple | null,
    ) => {
      const intent = getFeeStatus(fee)?.intent;
      const timer = startTimer(getResultSeconds(intent), reset);
      setState({ ...INITIAL_STATE, status, response, fee, timer });
    },
    [startTimer, reset],
  );

  const dismissError = useCallback(() => {
    clearTimer();
    setState(INITIAL_STATE);
  }, [clearTimer]);

  useEffect(() => {
    if (state.status !== REQUEST_STATUS.IDLE || dni.length === 0) return;
    const id = setTimeout(dniClear, CHECK_IN_TIMEOUTS.idleDni);
    return () => clearTimeout(id);
  }, [state.status, dni, dniClear]);

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

  const setDni = useCallback(
    (value: string) => {
      if (state.status === REQUEST_STATUS.ERROR) {
        dismissError();
      }
      dniReplace(value);
    },
    [state.status, dismissError, dniReplace],
  );

  const submit = useCallback(() => {
    if (state.status !== REQUEST_STATUS.IDLE) return;
    if (!isValid) return;
    if (mutation.isPending) return;

    setState({ ...INITIAL_STATE, status: REQUEST_STATUS.LOADING });

    mutation.mutate(dni, {
      onSuccess: (response) => {
        if (response.departureTime != null) {
          showResult(ATTENDANCE_ACTION.EXIT, response);
          return;
        }

        if (isRepeatCheckIn(response)) {
          showResult(ATTENDANCE_ACTION.REPEAT, response);
          return;
        }

        const timer = startTimer(MOOD_SECONDS, () =>
          showResult(ATTENDANCE_ACTION.ENTRY, response),
        );
        setState({
          ...INITIAL_STATE,
          status: REQUEST_STATUS.MOOD_SELECTION,
          response,
          timer,
        });
      },
      onError: (err) => {
        dniClear();
        setState({
          ...INITIAL_STATE,
          status: REQUEST_STATUS.ERROR,
          error: getCheckInErrorMessage(err),
        });
      },
    });
  }, [state.status, dni, isValid, dniClear, mutation, startTimer, showResult]);

  const selectMood = useCallback(
    (mood: Mood) => {
      if (state.status !== REQUEST_STATUS.MOOD_SELECTION) return;
      if (moodMutation.isPending) return;

      const currentResponse = state.response;
      if (!currentResponse) return;

      clearTimer();
      setState((prev) => ({
        ...prev,
        status: REQUEST_STATUS.MOOD_LOADING,
        timer: null,
      }));

      moodMutation.mutate(
        { id: currentResponse.id, mood },
        {
          onSuccess: (data) => {
            showResult(
              ATTENDANCE_ACTION.ENTRY,
              {
                ...currentResponse,
                mood,
                profileImageUrl:
                  data.profileImageUrl ?? currentResponse.profileImageUrl,
              },
              resolveCheckInFee(currentResponse, data.fee),
            );
          },
          onError: (err) => {
            showResult(
              ATTENDANCE_ACTION.ENTRY,
              currentResponse,
              isMissingFeeError(err)
                ? resolveCheckInFee(currentResponse)
                : undefined,
            );
          },
        },
      );
    },
    [state.status, state.response, moodMutation, clearTimer, showResult],
  );

  useEffect(() => clearTimer, [clearTimer]);

  return {
    status: state.status,
    response: state.response,
    error: state.error,
    fee: state.fee,
    timer: state.timer,

    dni,
    addDigit,
    removeDigit,
    setDni,
    isValid,
    canAddDigit,
    isEmpty,

    submit,
    selectMood,
    dismiss: reset,
    reset,
  };
}
