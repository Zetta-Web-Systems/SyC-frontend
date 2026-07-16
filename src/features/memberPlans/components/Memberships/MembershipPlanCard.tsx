import { CreditCard } from "lucide-react";
import { Card, InlineEditField } from "@shared/ui";
import { formatCurrency } from "@shared/utils/currency.utils";
import type { MemberPlanType } from "../../types";

interface MembershipPlanCardProps {
  planType: MemberPlanType;
  label: string;
  price: number;
  onPriceChange: (planType: MemberPlanType, price: number) => void;
}

export function MembershipPlanCard({
  planType,
  label,
  price,
  onPriceChange,
}: MembershipPlanCardProps) {
  return (
    <Card surface="panel" padding="lg" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
          <CreditCard size={18} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-neutral-900">{label}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <InlineEditField
          type="number"
          value={price}
          min={0}
          onChange={(next) => onPriceChange(planType, next)}
          format={(value) => formatCurrency(value)}
          ariaLabel={`Editar precio de ${label}`}
          className="text-2xl font-bold text-neutral-900"
          inputClassName="w-24 text-2xl"
        />
        <span className="text-xs text-neutral-400">/ mes</span>
      </div>
    </Card>
  );
}

MembershipPlanCard.displayName = "MembershipPlanCard";
