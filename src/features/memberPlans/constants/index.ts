import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";
import {
  FEE_STATE,
  MEMBER_PLAN_TYPE,
  PAYMENT_METHOD,
  type FeeState,
  type MemberPlanType,
  type PaymentMethod,
} from "../types";

export const MEMBER_PLAN_KEYS = {
  all: ["member-plan"] as const,
  fees: () => [...MEMBER_PLAN_KEYS.all, "fees"] as const,
  feeList: (params: PaginatedParams) =>
    [...MEMBER_PLAN_KEYS.fees(), "list", params] as const,
  history: (memberId: string) =>
    [...MEMBER_PLAN_KEYS.all, "history", memberId] as const,
} as const;

type BadgeIntent =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "violet"
  | "neutral";

export const FEE_STATE_LABELS: Record<FeeState, string> = {
  [FEE_STATE.PAID]: "Pagada",
  [FEE_STATE.PARTIAL_PAYMENT]: "Pago parcial",
  [FEE_STATE.PENDING]: "Pendiente",
  [FEE_STATE.EXPIRED]: "Vencida",
};

export const FEE_STATE_INTENT: Record<FeeState, BadgeIntent> = {
  [FEE_STATE.PAID]: "success",
  [FEE_STATE.PARTIAL_PAYMENT]: "info",
  [FEE_STATE.PENDING]: "warning",
  [FEE_STATE.EXPIRED]: "error",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.CASH]: "Efectivo",
  [PAYMENT_METHOD.DEBIT_CARD]: "Débito",
  [PAYMENT_METHOD.CREDIT_CARD]: "Crédito",
  [PAYMENT_METHOD.TRANSFER]: "Transferencia",
  [PAYMENT_METHOD.OTHER]: "Otro",
};

export const MEMBER_PLAN_TYPE_LABELS: Record<MemberPlanType, string> = {
  [MEMBER_PLAN_TYPE.MEMBER_PLAN_1_DAY_PER_WEEK]: "1 día por semana",
  [MEMBER_PLAN_TYPE.MEMBER_PLAN_2_DAYS_PER_WEEK]: "2 días por semana",
  [MEMBER_PLAN_TYPE.MEMBER_PLAN_3_DAYS_PER_WEEK]: "3 días por semana",
  [MEMBER_PLAN_TYPE.MEMBER_PLAN_4_DAYS_PER_WEEK]: "4 días por semana",
  [MEMBER_PLAN_TYPE.MEMBER_PLAN_5_DAYS_PER_WEEK]: "5 días por semana",
};

export const FEE_STATE_FILTER_OPTIONS: FilterOption[] = Object.entries(
  FEE_STATE_LABELS,
).map(([value, label]) => ({ value, label }));

export const MEMBER_PLAN_TYPE_FILTER_OPTIONS: FilterOption[] = Object.entries(
  MEMBER_PLAN_TYPE_LABELS,
).map(([value, label]) => ({ value, label }));

export const PAYMENT_METHOD_OPTIONS: FilterOption[] = Object.entries(
  PAYMENT_METHOD_LABELS,
).map(([value, label]) => ({ value, label }));

export const MEMBER_PLAN_TYPES_ORDER: MemberPlanType[] = [
  MEMBER_PLAN_TYPE.MEMBER_PLAN_1_DAY_PER_WEEK,
  MEMBER_PLAN_TYPE.MEMBER_PLAN_2_DAYS_PER_WEEK,
  MEMBER_PLAN_TYPE.MEMBER_PLAN_3_DAYS_PER_WEEK,
  MEMBER_PLAN_TYPE.MEMBER_PLAN_4_DAYS_PER_WEEK,
  MEMBER_PLAN_TYPE.MEMBER_PLAN_5_DAYS_PER_WEEK,
];

export const BILLING_FILTER_SCHEMA = {
  feeState: { apiKey: "feeState", initial: [] },
  memberPlanType: { apiKey: "memberPlanType", initial: [] },
  memberId: { apiKey: "memberId", initial: [] },
} as const satisfies FilterSchema;

export const PAYMENT_NOTES_MAX_LENGTH = 255;
