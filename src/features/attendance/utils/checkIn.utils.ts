import { AxiosError } from "axios";
import { getApiErrorMessage } from "@shared/api/apiError";
import { getDaysUntil } from "@shared/utils/date.utils";
import {
  FEE_STATE,
  getFeeDueStatus,
  type FeeSimple,
} from "@features/memberPlans";
import {
  CHECK_IN_ERROR_MESSAGES,
  MONTH_NAMES,
  PERSON_TYPE,
  RESULT_SECONDS,
  WEEKDAY_NAMES,
  type FeeStatusIntent,
} from "../constants";
import type { AttendanceCheckIn, FeeStatusView } from "../types";

const PAY_AT_DESK = "Podés pagarla en recepción.";

const NO_FEE_STATUS: FeeStatusView = {
  intent: "neutral",
  label: "Sin cuota registrada",
  dateCaption: null,
  date: null,
  countdown: null,
  advice: "Hablá con el dueño para que te asigne un plan.",
};

function capitalize(text: string): string {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function toLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function countDays(days: number): string {
  return days === 1 ? "1 día" : `${days} días`;
}

function getCountdown(daysLeft: number): string {
  if (daysLeft === 1) return "Falta 1 día";
  if (daysLeft > 1) return `Faltan ${daysLeft} días`;
  if (daysLeft === 0) return "Es hoy";
  return `Venció hace ${countDays(-daysLeft)}`;
}

export function formatClockTime(date: Date): string {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function formatKioskDate(date: Date): string {
  return `${capitalize(WEEKDAY_NAMES[date.getDay()])} ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatWeekday(date: Date): string {
  return capitalize(WEEKDAY_NAMES[date.getDay()]);
}

export function formatDayMonth(date: Date): string {
  return `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
}

export function getInitials(name: string, lastname: string): string {
  return `${name.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
}

export function getFeeStatus(
  fee: FeeSimple | null | undefined,
  now: Date = new Date(),
): FeeStatusView | null {
  if (fee === null) return NO_FEE_STATUS;
  if (!fee) return null;

  const { intent } = getFeeDueStatus(fee);
  const daysLeft = getDaysUntil(fee.endDate, now);
  const base = {
    intent,
    date: toLocalDate(fee.endDate),
    dateCaption: "Fecha de pago",
    countdown: getCountdown(daysLeft),
  };

  if (fee.feeState === FEE_STATE.PAID) {
    return {
      ...base,
      label: "Cuota pagada",
      dateCaption: "Próxima fecha de pago",
      advice: null,
    };
  }

  if (fee.feeState === FEE_STATE.PARTIAL_PAYMENT) {
    return {
      ...base,
      label: "Cuota pagada en parte",
      advice: "Te queda un saldo por pagar.",
    };
  }

  if (fee.feeState === FEE_STATE.EXPIRED) {
    return {
      ...base,
      label: "Cuota vencida",
      countdown:
        daysLeft < 0 ? `Venció hace ${countDays(-daysLeft)}` : "Venció",
      advice: "Pagala en recepción.",
    };
  }

  if (daysLeft <= 0) {
    return {
      ...base,
      label: "Cuota vence hoy",
      countdown: "Es hoy",
      advice: PAY_AT_DESK,
    };
  }

  if (intent === "warning") {
    return {
      ...base,
      label: "Cuota por vencer",
      advice: PAY_AT_DESK,
    };
  }

  return { ...base, label: "Cuota al día", advice: null };
}

export function getResultSeconds(intent: FeeStatusIntent | undefined): number {
  return !intent || intent === "success"
    ? RESULT_SECONDS.calm
    : RESULT_SECONDS.attention;
}

export function resolveCheckInFee(
  response: AttendanceCheckIn,
  fee?: FeeSimple,
): FeeSimple | null | undefined {
  if (fee) return fee;
  return response.type === PERSON_TYPE.MEMBER ? null : undefined;
}

export function isMissingFeeError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404;
}

export function isRepeatCheckIn(response: AttendanceCheckIn): boolean {
  return response.departureTime == null && response.mood != null;
}

export function getCheckInErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) return CHECK_IN_ERROR_MESSAGES.OFFLINE;
    if (error.response.status === 404) return CHECK_IN_ERROR_MESSAGES.NOT_FOUND;
    if (error.response.status === 409) return CHECK_IN_ERROR_MESSAGES.TOO_SOON;
  }
  return getApiErrorMessage(error, CHECK_IN_ERROR_MESSAGES.OFFLINE);
}
