import { getDaysUntil } from "@shared/utils/date.utils";
import { FEE_STATE, type Fee } from "../types";

type FeeDueIntent = "success" | "warning" | "error" | "info";

export interface FeeDueStatus {
  label: string;
  intent: FeeDueIntent;
}

const GREEN_THRESHOLD_DAYS = 15;

export type FeeDueSource = Pick<Fee, "feeState" | "endDate">;

export function getFeeDueStatus(fee: FeeDueSource): FeeDueStatus {
  if (fee.feeState === FEE_STATE.EXPIRED) {
    return { label: "Vencida", intent: "error" };
  }
  if (fee.feeState === FEE_STATE.PAID) {
    return { label: "Pagada", intent: "success" };
  }
  if (fee.feeState === FEE_STATE.PARTIAL_PAYMENT) {
    return { label: "Pago parcial", intent: "info" };
  }

  const days = getDaysUntil(fee.endDate);
  const label =
    days <= 0 ? "Vence hoy" : `Vence en ${days} día${days === 1 ? "" : "s"}`;
  const intent: FeeDueIntent =
    days >= GREEN_THRESHOLD_DAYS ? "success" : "warning";

  return { label, intent };
}
