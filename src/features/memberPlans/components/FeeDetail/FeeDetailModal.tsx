import { Modal, Badge, Avatar } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import { formatCurrency } from "@shared/utils/currency.utils";
import type { Fee } from "../../types";
import {
  FEE_STATE_INTENT,
  FEE_STATE_LABELS,
  PAYMENT_METHOD_LABELS,
} from "../../constants";
import { getFeeNotes } from "../../lib/feeNotes";

interface FeeDetailModalProps {
  fee: Fee | null;
  open: boolean;
  onClose: () => void;
}

export function FeeDetailModal({ fee, open, onClose }: FeeDetailModalProps) {
  if (!fee) return null;

  const { member } = fee;
  const fullName = `${member.name} ${member.lastname}`;
  const initials = (
    member.name.charAt(0) + member.lastname.charAt(0)
  ).toUpperCase();
  const remaining = fee.totalAmount - fee.amountPaid;
  const notes = getFeeNotes(fee.payments);

  return (
    <Modal open={open} onClose={onClose} title="Detalle de la cuota" size="md">
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar
              size="md"
              color="primary"
              src={member.image ?? null}
              fallback={initials}
              alt={fullName}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">
                {fullName}
              </span>
              <span className="text-xs text-neutral-500">
                {formatDate(fee.startDate)} – {formatDate(fee.endDate)}
              </span>
            </div>
          </div>
          <Badge intent={FEE_STATE_INTENT[fee.feeState]} size="sm">
            {FEE_STATE_LABELS[fee.feeState]}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-neutral-50 p-3 text-center">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">Total</span>
            <span className="font-semibold text-neutral-900">
              {formatCurrency(fee.totalAmount)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">Pagado</span>
            <span className="font-semibold text-neutral-900">
              {formatCurrency(fee.amountPaid)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">Resta</span>
            <span className="font-semibold text-neutral-900">
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {fee.lateChargeAmount ? (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Recargo por mora</span>
            <span className="font-medium text-neutral-900">
              {formatCurrency(fee.lateChargeAmount)}
            </span>
          </div>
        ) : null}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-900">
            Observaciones ({notes.length})
          </h3>
          {notes.length === 0 ? (
            <p className="text-sm italic text-neutral-400">
              Sin observaciones registradas.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-info/20 bg-info/5 p-3"
                >
                  <p className="text-sm text-neutral-800">{note.text}</p>
                  <span className="mt-1 block text-xs text-neutral-500">
                    {formatDate(note.date)} · {formatCurrency(note.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-900">
            Pagos ({fee.payments.length})
          </h3>
          {fee.payments.length === 0 ? (
            <p className="text-sm text-neutral-400">
              Todavía no se registraron pagos.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-neutral-100">
              {fee.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-start justify-between gap-3 py-2.5"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-neutral-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {PAYMENT_METHOD_LABELS[payment.paymentMethod]} ·{" "}
                      {formatDate(payment.date)}
                    </span>
                  </div>
                  {payment.registeredBy && (
                    <span className="shrink-0 text-xs text-neutral-400">
                      {payment.registeredBy.name}{" "}
                      {payment.registeredBy.lastname}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

FeeDetailModal.displayName = "FeeDetailModal";
