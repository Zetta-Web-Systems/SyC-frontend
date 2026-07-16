import { z } from "zod";
import { PAYMENT_METHOD, type PaymentMethod } from "../types";

const paymentMethodEnum = z.enum(
  Object.values(PAYMENT_METHOD) as [PaymentMethod, ...PaymentMethod[]],
);

export function buildPaymentSchema(amountDue: number) {
  return z.object({
    amount: z
      .number({ error: "Ingresá un monto" })
      .positive("El monto debe ser mayor a 0")
      .max(amountDue, "No puede superar lo adeudado"),
    paymentMethod: paymentMethodEnum,
  });
}

export type PaymentSchema = z.infer<ReturnType<typeof buildPaymentSchema>>;
