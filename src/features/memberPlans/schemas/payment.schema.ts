import { z } from "zod";
import {
  MEMBER_PLAN_TYPE,
  PAYMENT_METHOD,
  type MemberPlanType,
  type PaymentMethod,
} from "../types";
import { PAYMENT_NOTES_MAX_LENGTH } from "../constants";

const paymentMethodEnum = z.enum(
  Object.values(PAYMENT_METHOD) as [PaymentMethod, ...PaymentMethod[]],
);

const memberPlanTypeEnum = z.enum(
  Object.values(MEMBER_PLAN_TYPE) as [MemberPlanType, ...MemberPlanType[]],
);

export function buildPaymentSchema(amountDue: number) {
  return z.object({
    amount: z
      .number({ error: "Ingresá un monto" })
      .positive("El monto debe ser mayor a 0")
      .max(amountDue, "No puede superar lo adeudado"),
    paymentMethod: paymentMethodEnum,
    memberPlanType: memberPlanTypeEnum.optional(),
    notes: z
      .string()
      .max(
        PAYMENT_NOTES_MAX_LENGTH,
        `No puede superar los ${PAYMENT_NOTES_MAX_LENGTH} caracteres`,
      )
      .optional(),
  });
}

export type PaymentSchema = z.infer<ReturnType<typeof buildPaymentSchema>>;
