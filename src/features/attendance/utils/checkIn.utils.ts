import { AxiosError } from "axios";
import { getApiErrorMessage } from "@shared/api/apiError";
import { getDaysUntil } from "@shared/utils/date.utils";
import { FEE_STATE, getFeeDueStatus } from "@features/memberPlans";
import {
  CHECK_IN_ERROR_MESSAGES,
  FEE_STATUS_KIND,
  MONTH_NAMES,
  RESULT_SECONDS,
  WEEKDAY_NAMES,
  type FeeStatusIntent,
} from "../constants";
import type { AttendanceCheckIn, AttendanceFee, FeeStatusView } from "../types";

const PAY_AT_DESK = "Podés pagarla en recepción.";

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
  fee: AttendanceFee | null | undefined,
  feeMessage?: string | null,
  now: Date = new Date(),
): FeeStatusView | null {
  if (!fee) {
    if (fee === null || !feeMessage) return null;
    return {
      kind: FEE_STATUS_KIND.UNKNOWN,
      intent: "neutral",
      label: "Cuota",
      dateCaption: null,
      date: null,
      countdown: null,
      advice: null,
      message: feeMessage,
    };
  }

  const { intent } = getFeeDueStatus(fee);
  const daysLeft = getDaysUntil(fee.endDate, now);
  const base = {
    intent,
    date: toLocalDate(fee.endDate),
    dateCaption: "Fecha de pago",
    countdown: getCountdown(daysLeft),
    message: null,
  };

  if (fee.feeState === FEE_STATE.PAID) {
    return {
      ...base,
      kind: FEE_STATUS_KIND.PAID,
      label: "Cuota pagada",
      dateCaption: "Próxima fecha de pago",
      advice: null,
    };
  }

  if (fee.feeState === FEE_STATE.PARTIAL_PAYMENT) {
    return {
      ...base,
      kind: FEE_STATUS_KIND.PARTIAL,
      label: "Cuota pagada en parte",
      advice: "Te queda un saldo por pagar.",
    };
  }

  if (fee.feeState === FEE_STATE.EXPIRED) {
    return {
      ...base,
      kind: FEE_STATUS_KIND.EXPIRED,
      label: "Cuota vencida",
      countdown:
        daysLeft < 0 ? `Venció hace ${countDays(-daysLeft)}` : "Venció",
      advice: "Pagala en recepción.",
    };
  }

  if (daysLeft <= 0) {
    return {
      ...base,
      kind: FEE_STATUS_KIND.DUE_TODAY,
      label: "Cuota vence hoy",
      countdown: "Es hoy",
      advice: PAY_AT_DESK,
    };
  }

  if (intent === "warning") {
    return {
      ...base,
      kind: FEE_STATUS_KIND.DUE_SOON,
      label: "Cuota por vencer",
      advice: PAY_AT_DESK,
    };
  }

  return {
    ...base,
    kind: FEE_STATUS_KIND.UP_TO_DATE,
    label: "Cuota al día",
    advice: null,
  };
}

export function getResultSeconds(
  intent: FeeStatusIntent | null | undefined,
): number {
  return !intent || intent === "success" || intent === "neutral"
    ? RESULT_SECONDS.calm
    : RESULT_SECONDS.attention;
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
