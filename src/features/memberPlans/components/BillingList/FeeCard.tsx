import { Eye, DollarSign } from "lucide-react";
import { Avatar, Badge, Button } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import { formatCurrency } from "@shared/utils/currency.utils";
import type { Fee } from "../../types";
import { FEE_STATE } from "../../types";
import { FEE_STATE_INTENT, FEE_STATE_LABELS } from "../../constants";

interface FeeCardProps {
  fee: Fee;
  onViewDetail: (fee: Fee) => void;
  onRegisterPayment: (fee: Fee) => void;
}

export function FeeCard({
  fee,
  onViewDetail,
  onRegisterPayment,
}: FeeCardProps) {
  const { member } = fee;
  const initials = (
    member.name.charAt(0) + member.lastname.charAt(0)
  ).toUpperCase();
  const fullName = `${member.name} ${member.lastname}`;
  const remaining = fee.totalAmount - fee.amountPaid;
  const payable = fee.feeState !== FEE_STATE.PAID;

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <Avatar
          size="lg"
          color="primary"
          src={member.image ?? null}
          fallback={initials}
          alt={fullName}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {fullName}
          </p>
          <span className="text-xs text-neutral-500">
            {formatDate(fee.startDate)} – {formatDate(fee.endDate)}
          </span>
        </div>
        <Badge intent={FEE_STATE_INTENT[fee.feeState]} size="sm">
          {FEE_STATE_LABELS[fee.feeState]}
        </Badge>
      </div>

      <hr className="my-3 border-neutral-200" />

      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Total</span>
          <span className="font-medium text-neutral-900">
            {formatCurrency(fee.totalAmount)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Pagado</span>
          <span className="font-medium text-neutral-900">
            {formatCurrency(fee.amountPaid)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Resta</span>
          <span className="font-medium text-neutral-900">
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant="outline"
          intent="neutral"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetail(fee)}
        >
          <Eye size={14} aria-hidden="true" /> Detalle
        </Button>
        {payable && (
          <Button
            intent="primary"
            size="sm"
            className="flex-1"
            onClick={() => onRegisterPayment(fee)}
          >
            <DollarSign size={14} aria-hidden="true" /> Pago
          </Button>
        )}
      </div>
    </div>
  );
}

FeeCard.displayName = "FeeCard";
