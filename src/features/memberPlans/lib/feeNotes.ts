import type { Payment } from "../types";

export interface FeeNote {
  id: string;
  date: string;
  amount: number;
  text: string;
}

export function getFeeNotes(payments: Payment[]): FeeNote[] {
  return payments.flatMap((payment) => {
    const text = payment.notes?.trim();
    if (!text) return [];

    return [
      { id: payment.id, date: payment.date, amount: payment.amount, text },
    ];
  });
}
