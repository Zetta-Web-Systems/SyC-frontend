export const FEE_STATE = {
  PAID: "PAID",
  PARTIAL_PAYMENT: "PARTIAL_PAYMENT",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
} as const;

export type FeeState = (typeof FEE_STATE)[keyof typeof FEE_STATE];

export const PAYMENT_METHOD = {
  CASH: "CASH",
  DEBIT_CARD: "DEBIT_CARD",
  CREDIT_CARD: "CREDIT_CARD",
  TRANSFER: "TRANSFER",
  OTHER: "OTHER",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const MEMBER_PLAN_TYPE = {
  MEMBER_PLAN_1_DAY_PER_WEEK: "MEMBER_PLAN_1_DAY_PER_WEEK",
  MEMBER_PLAN_2_DAYS_PER_WEEK: "MEMBER_PLAN_2_DAYS_PER_WEEK",
  MEMBER_PLAN_3_DAYS_PER_WEEK: "MEMBER_PLAN_3_DAYS_PER_WEEK",
  MEMBER_PLAN_4_DAYS_PER_WEEK: "MEMBER_PLAN_4_DAYS_PER_WEEK",
  MEMBER_PLAN_5_DAYS_PER_WEEK: "MEMBER_PLAN_5_DAYS_PER_WEEK",
} as const;

export type MemberPlanType =
  (typeof MEMBER_PLAN_TYPE)[keyof typeof MEMBER_PLAN_TYPE];

export interface FeeMemberSummary {
  id: string;
  name: string;
  lastname: string;
  image: string | null;
}

export interface PaymentRegisteredBy {
  id: string;
  name: string;
  lastname: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  registeredBy?: PaymentRegisteredBy;
  notes?: string;
}

export interface FeeSimple {
  id: string;
  startDate: string;
  endDate: string;
  feeState: FeeState;
  totalAmount: number;
  amountPaid: number;
  lateChargeAmount?: number | null;
}

export interface Fee extends FeeSimple {
  member: FeeMemberSummary;
  memberPlanType: MemberPlanType;
  payments: Payment[];
  lateChargeAmount: number | null;
}

export interface MemberPlanHistory {
  id: string;
  planType: MemberPlanType;
  memberResponseDto: FeeMemberSummary;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface MembershipHistoryItem {
  id: string;
  planType: MemberPlanType;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export type FeePaymentResult = Omit<Fee, "member">;

export interface RegisterPaymentDto {
  feeId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  memberPlanType?: MemberPlanType;
  notes?: string;
}

export interface RegisterMembershipDto {
  memberId: string;
  memberPlanType: MemberPlanType;
}
