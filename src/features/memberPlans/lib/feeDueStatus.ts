import { FEE_STATE, type Fee } from "../types";

type FeeDueIntent = "success" | "warning" | "error";

export interface FeeDueStatus {
  label: string;
  intent: FeeDueIntent;
}

const GREEN_THRESHOLD_DAYS = 15;

function daysUntil(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day).getTime();
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  return Math.round((target - today) / 86_400_000);
}

export function getFeeDueStatus(fee: Fee): FeeDueStatus {
  if (fee.feeState === FEE_STATE.EXPIRED) {
    return { label: "Vencida", intent: "error" };
  }
  if (fee.feeState === FEE_STATE.PAID) {
    return { label: "Pagada", intent: "success" };
  }

  const days = daysUntil(fee.endDate);
  const label =
    days <= 0 ? "Vence hoy" : `Vence en ${days} día${days === 1 ? "" : "s"}`;
  const intent: FeeDueIntent =
    days >= GREEN_THRESHOLD_DAYS ? "success" : "warning";

  return { label, intent };
}
